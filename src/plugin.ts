import {
  ShortcutTypes, MessageTypes, FormValues, FormValuesAccess, FormInputs, Message,
} from './types';

// Initial the plugin UI.
figma.showUI(__html__);
// Rezise the plugin UI to the desired size.
figma.ui.resize(350, 370);

/**
 * Removes duplicates and adds an array of unique guides to the given frame node.
 * @param frame Figma frame node
 * @param guides Array of guides including duplicate guides to be added in to the given frame.
 */
const addGuide = (frame: FrameNode, guides: Guide[]): void => {
  const guideString = ({ axis, offset }): string => `${axis}_${offset}`;
  const existingGuidesLookupMap = frame.guides.map(guideString);
  const filteredGuides = guides.filter(
    (guide): boolean => !existingGuidesLookupMap.includes(guideString(guide)),
  );
  const { parent } = frame;
  const clone = frame.clone();
  const isFrameSelected = clone.getPluginData('x-selected') === 'true';
  const selectedInClone = clone.findOne(
    (node): boolean => node.getPluginData('x-selected') === 'true',
  );
  clone.guides = guides.length === 0 ? [] : frame.guides.concat(filteredGuides);
  if (isFrameSelected) {
    figma.currentPage.selection = [clone as any];
    clone.setPluginData('x-selected', 'false');
  } else if (selectedInClone) {
    figma.currentPage.selection = [selectedInClone as any];
    selectedInClone.setPluginData('x-selected', 'false');
  }
  parent.appendChild(clone);
  frame.remove();
};

/**
 * Returns the frame node if found initially or recursively fetch the parent till frame
 * node is found.
 * @param node Current selection node.
 */
const findFrame = (node: BaseNode): FrameNode => {
  if (node.type === 'PAGE') {
    figma.ui.postMessage({ type: MessageTypes.NO_FRAME_ERROR });
    return undefined;
  }
  if (node.type === 'FRAME') {
    return node;
  }
  return findFrame(node.parent);
};

/**
 * Returns the current user selected node else returns the frame node when only one frame is found
 * in the tab. Throws an error when no frame or more than one frame is found in the tab.
 */
const getSelection = (): SceneNode | undefined => {
  const { selection } = figma.currentPage;

  if (selection.length === 0) {
    figma.ui.postMessage({ type: MessageTypes.NO_SELECTION_ERROR });
    return undefined;
  }

  if (selection.length > 1) {
    figma.ui.postMessage({ type: MessageTypes.MULTI_SELECTION_ERROR });
    return undefined;
  }

  const currentSelection = selection[0];
  currentSelection.setPluginData('x-selected', 'true');
  return currentSelection;
};

/**
 * Adds guides based on the shortcut selection.
 * @param shortcut
 */
const handleShortcuts = (shortcut: ShortcutTypes): void => {
  const currentSelection = getSelection();
  if (!currentSelection) return;
  const frame = findFrame(currentSelection);
  if (!frame) return;
  const {
    width, height, x: selectionX, y: selectionY,
  } = currentSelection;
  const isSelectedFrame = frame === currentSelection;
  const x = isSelectedFrame ? 0 : selectionX;
  const y = isSelectedFrame ? 0 : selectionY;
  let guide: Guide[];

  switch (shortcut) {
    case ShortcutTypes.LEFT:
      guide = [{ axis: 'X', offset: x }];
      break;
    case ShortcutTypes.RIGHT:
      guide = [{ axis: 'X', offset: x + width }];
      break;
    case ShortcutTypes.VERTICAL_CENTER:
      guide = [{ axis: 'X', offset: x + (width / 2) }];
      break;
    case ShortcutTypes.TOP:
      guide = [{ axis: 'Y', offset: y }];
      break;
    case ShortcutTypes.HORIZONTAL_CENTER:
      guide = [{ axis: 'Y', offset: y + (height / 2) }];
      break;
    case ShortcutTypes.BOTTOM:
      guide = [{ axis: 'Y', offset: y + height }];
      break;
    case ShortcutTypes.CLEAR:
      guide = [];
      break;
    default:
      console.warn(`Unhandled shortcut: ${shortcut}`);
  }
  addGuide(frame, guide);
};

/**
 * Computes and returns incremental guides width/length and their position with gutter space
 * considered.
 * @param count Total number of guide blocks to be added.
 * @param size Width or height of each guide block.
 * @param start Starting point of the first guide block.
 * @param gutter Gutter space between two guide blocks.
 * @param axis Axis to which the guide block should be added.
 */
const calculateGuideBlock = (
  count: number,
  size: number,
  start: number,
  gutter: number,
  axis: 'X' | 'Y',
): Guide[] => {
  const guides = [];
  let nextStart = start + size;
  for (let i = 0; i < count; i++) {
    if (i === 1 || i === count) {
      continue;
    }
    guides.push({
      axis,
      offset: nextStart,
    });
    if (gutter) {
      guides.push({
        axis,
        offset: nextStart + gutter,
      });
      nextStart = nextStart + gutter + size;
      continue;
    }
    nextStart += size;
  }
  return guides;
};

/**
 * Adds guides to the selected frame based on the user supplied form data.
 * @param formData User input object containing the form values.
 */
const handleAddGuides = (formData: FormValues[]): void => {
  const currentSelection = getSelection();
  if (!currentSelection) return;
  const frame = findFrame(currentSelection);
  if (!frame) return;
  const {
    width, height, x: selectionX, y: selectionY,
  } = currentSelection;
  const isSelectedFrame = frame === currentSelection;
  const x = isSelectedFrame ? 0 : selectionX;
  const y = isSelectedFrame ? 0 : selectionY;
  const formDataObject = formData.reduce(
    (acc, { id, value }): FormValuesAccess => ({ ...acc, ...{ [id]: value } }), {},
  );
  const marginGuides = formData.map(({ id, value }): Guide => {
    switch (id) {
      case FormInputs.TOP_MARGIN:
        return { axis: 'Y', offset: y + value };
      case FormInputs.BOTTOM_MARGIN:
        return { axis: 'Y', offset: y + (height - value) };
      case FormInputs.LEFT_MARGIN:
        return { axis: 'X', offset: x + value };
      case FormInputs.RIGHT_MARGIN:
        return { axis: 'X', offset: x + (width - value) };
      default:
        return undefined;
    }
  }).filter(Boolean);

  const rowGutter = formDataObject[FormInputs.HORIZONTAL_GUTTER];
  const columnGutter = formDataObject[FormInputs.VERTICAL_GUTTER];
  const leftMargin = formDataObject[FormInputs.LEFT_MARGIN];
  const rightMargin = formDataObject[FormInputs.RIGHT_MARGIN];
  const topMargin = formDataObject[FormInputs.TOP_MARGIN];
  const bottomMargin = formDataObject[FormInputs.BOTTOM_MARGIN];
  const columns = formDataObject[FormInputs.NO_OF_COLUMNS];
  const rows = formDataObject[FormInputs.NO_OF_ROWS];
  const columnWidth = Math.round(
    (width - (leftMargin + rightMargin + ((columns - 1) * columnGutter))) / columns,
  );
  const rowHeight = Math.round(
    (height - (topMargin + bottomMargin + ((rows - 1) * rowGutter))) / rows,
  );
  const columnGuides = calculateGuideBlock(columns, columnWidth, x + leftMargin, columnGutter, 'X');
  const rowGuides = calculateGuideBlock(rows, rowHeight, y + topMargin, rowGutter, 'Y');

  addGuide(frame, [...marginGuides, ...columnGuides, ...rowGuides]);
};

/**
 * Handles all messages from parent.
 */
figma.ui.onmessage = (msg: Message): void => {
  switch (msg.type) {
    case MessageTypes.SHORTCUTS:
      handleShortcuts(msg.data);
      break;
    case MessageTypes.ADD_GUIDES:
      handleAddGuides(msg.data);
      break;
    default:
      console.warn(`Unhandled message type: ${msg.type}`);
  }
};
