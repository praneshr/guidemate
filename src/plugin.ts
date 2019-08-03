import { ShortcutTypes, MessageTypes, FormValues, FormValuesAccess, FormInputs } from './types';

figma.showUI(__html__);
figma.ui.resize(350, 370);

const checkSelection = (): void => {
  const { selection } = figma.currentPage;
  if (selection.length === 0) {
    throw new Error('Select one layer to use Guide Mate');
  }
  if (selection.length > 1) {
    throw new Error('Multi selection is not supported');
  }
};

const addGuide = (frame: FrameNode, guides: Guide[]): void => {
  const guideString = ({ axis, offset }): string => `${axis}_${offset}`;
  const existingGuidesLookupMap = frame.guides.map(guideString);
  const filteredGuides = guides.filter((guide): boolean => !existingGuidesLookupMap.includes(guideString(guide)));

  frame.guides = frame.guides.concat(filteredGuides);
};

const findFrame = (node: any): FrameNode => {
  if (node.type === 'FRAME') {
    return node;
  }
  return findFrame(node.parent);
};

const handleShortcuts = (shortcut: ShortcutTypes): void => {
  const { selection } = figma.currentPage;
  const currentSelection = selection[0];
  const frame = findFrame(currentSelection);
  const { width, height, x: selectionX, y: selectionY } = currentSelection;
  const isSelectedFrame = frame === currentSelection;
  const x = isSelectedFrame ? 0 : selectionX;
  const y = isSelectedFrame ? 0 : selectionY;
  let guide;

  switch (shortcut) {
    case ShortcutTypes.LEFT:
      guide = { axis: 'X', offset: x };
      break;
    case ShortcutTypes.RIGHT:
      guide = { axis: 'X', offset: x + width };
      break;
    case ShortcutTypes.VERTICAL_CENTER:
      guide = { axis: 'X', offset: x + (width / 2) };
      break;
    case ShortcutTypes.TOP:
      guide = { axis: 'Y', offset: y };
      break;
    case ShortcutTypes.HORIZONTAL_CENTER:
      guide = { axis: 'Y', offset: y + (height / 2) };
      break;
    case ShortcutTypes.BOTTOM:
      guide = { axis: 'Y', offset: y + height };
      break;
    case ShortcutTypes.CLEAR:
      frame.guides = [];
      return;
    default:
      console.warn(`Unhandled shortcut: ${shortcut}`);
  }
  addGuide(frame, [guide]);
};

const calculateGuideBlock = (count, size, start, gutter, axis): any => {
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


const handleAddGuides = (formData: FormValues[]): void => {
  const { selection } = figma.currentPage;
  const currentSelection = selection[0];
  const frame = findFrame(currentSelection);
  const { width, height, x: selectionX, y: selectionY } = currentSelection;
  const isSelectedFrame = frame === currentSelection;
  const x = isSelectedFrame ? 0 : selectionX;
  const y = isSelectedFrame ? 0 : selectionY;
  const formDataObject = formData.reduce((acc, { id, value }): FormValuesAccess => ({ ...acc, ...{ [id]: value } }), {});
  const marginGuides = formData.map(({ id, value }): any => {
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
  const columnWidth = Math.round((width - (leftMargin + rightMargin + ((columns - 1) * columnGutter))) / columns);
  const rowHeight = Math.round((height - (topMargin + bottomMargin + ((rows - 1) * rowGutter))) / rows);

  const columnGuides = calculateGuideBlock(columns, columnWidth, x + leftMargin, columnGutter, 'X');
  const rowGuides = calculateGuideBlock(rows, rowHeight, y + topMargin, rowGutter, 'Y');
  addGuide(frame, [...marginGuides, ...columnGuides, ...rowGuides]);
};

figma.ui.onmessage = (msg: any): void => {
  checkSelection();
  switch (msg.type) {
    case MessageTypes.SHORTCUTS:
      handleShortcuts(msg.data);
      break;
    case MessageTypes.ADD_GUIDES:
      handleAddGuides(msg.data);
      break;
    default:
  }
};
