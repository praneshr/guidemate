import {
  LitElement, customElement, TemplateResult, html, css, CSSResult,
} from 'lit-element';

import { ShortcutTypes, MessageTypes } from '../types';

const tippy = require('tippy.js').default;


@customElement('x-easy-shortcuts')
export default class EasyShortcuts extends LitElement {
  public static get styles(): CSSResult {
    return css`
      .shortcuts {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--side-padding);
        border-bottom: 1px solid #1f1f2d;
      }
      .shortcut {
        cursor: pointer;
      }
    `;
  }

  /**
   * Posts message to parent with about the user selection.
   * @param event Mouse event
   */
  private shortcutClick_(event: any): void {
    const { type } = event.currentTarget.dataset;
    parent.postMessage({ pluginMessage: { type: MessageTypes.SHORTCUTS, data: parseInt(type) } }, '*');
  }

  public firstUpdated(): void {
    tippy(this.renderRoot.querySelectorAll('.shortcut'), {
      placement: 'bottom',
      delay: 100,
      arrow: true,
    });
  }

  public render(): TemplateResult {
    return html`
      <div class="shortcuts">
        <span class="shortcut" @click=${this.shortcutClick_} data-type=${ShortcutTypes.LEFT} data-tippy-content="Set left">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><g fill="#18a0fb"><path d="M10,0H2A2,2,0,0,0,0,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V2A2,2,0,0,0,10,0ZM2,10V2h8l0,8Z" fill="#18a0fb"></path> <rect x="3" y="3" width="2" height="6" data-color="color-2"></rect></g></svg>
        </span>
        <span class="shortcut" @click=${this.shortcutClick_} data-type=${ShortcutTypes.VERTICAL_CENTER} data-tippy-content="Set vertical center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2L0 10C0 10.5304 0.210714 11.0391 0.585786 11.4142C0.960859 11.7893 1.46957 12 2 12H10C10.5304 12 11.0391 11.7893 11.4142 11.4142C11.7893 11.0391 12 10.5304 12 10V2C12 1.46957 11.7893 0.960859 11.4142 0.585786C11.0391 0.210714 10.5304 0 10 0V0ZM2 10V2H10V10H2Z" fill="#18a0fb"/>
            <path d="M7 3H5V9H7V3Z" fill="#18a0fb"/>
          </svg>
        </span>
        <span class="shortcut" @click=${this.shortcutClick_} data-type=${ShortcutTypes.RIGHT} data-tippy-content="Set right">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><g fill="#18a0fb"><path d="M10,0H2A2,2,0,0,0,0,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V2A2,2,0,0,0,10,0ZM2,10V2h8l0,8Z" fill="#18a0fb"></path> <rect x="7" y="3" width="2" height="6" data-color="color-2"></rect></g></svg>
        </span>
        <span class="shortcut" @click=${this.shortcutClick_} data-type=${ShortcutTypes.TOP} data-tippy-content="Set top">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><g fill="#18a0fb"><path d="M10,0H2A2,2,0,0,0,0,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V2A2,2,0,0,0,10,0ZM2,10V2h8l0,8Z" fill="#18a0fb"></path> <rect x="3" y="3" width="6" height="2" data-color="color-2"></rect></g></svg>
        </span>
        <span class="shortcut" @click=${this.shortcutClick_} data-type=${ShortcutTypes.HORIZONTAL_CENTER} data-tippy-content="Set horizontal center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2L0 10C0 10.5304 0.210714 11.0391 0.585786 11.4142C0.960859 11.7893 1.46957 12 2 12H10C10.5304 12 11.0391 11.7893 11.4142 11.4142C11.7893 11.0391 12 10.5304 12 10V2C12 1.46957 11.7893 0.960859 11.4142 0.585786C11.0391 0.210714 10.5304 0 10 0V0ZM2 10V2H10V10H2Z" fill="#18a0fb"/>
            <path d="M9 5H3V7H9V5Z" fill="#18a0fb"/>
          </svg>
        </span>
        <span class="shortcut" @click=${this.shortcutClick_} data-type=${ShortcutTypes.BOTTOM} data-tippy-content="Set bottom">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><g fill="#18a0fb"><path d="M10,0H2A2,2,0,0,0,0,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V2A2,2,0,0,0,10,0ZM2,10V2h8l0,8Z" fill="#18a0fb"></path> <rect x="3" y="7" width="6" height="2" data-color="color-2"></rect></g></svg>
        </span>
        <span class="shortcut" @click=${this.shortcutClick_} data-type=${ShortcutTypes.CLEAR} data-tippy-content="Clear">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><title>s-remove</title><g fill="#18a0fb"><path d="M10,0H2A2,2,0,0,0,0,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V2A2,2,0,0,0,10,0ZM2,10V2h8v8Z" fill="#18a0fb"></path> <path d="M8.354,3.646a.5.5,0,0,0-.708,0L6,5.293,4.354,3.646a.5.5,0,0,0-.708.708L5.293,6,3.646,7.646a.5.5,0,0,0,.708.708L6,6.707,7.646,8.354a.5.5,0,1,0,.708-.708L6.707,6,8.354,4.354A.5.5,0,0,0,8.354,3.646Z" data-color="color-2"></path></g></svg>
        </span>
      </div>
    `;
  }
}
