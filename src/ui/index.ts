import {
  LitElement, customElement, html, TemplateResult, css, CSSResult, property,
} from 'lit-element';

import { MessageTypes } from '../types';
import './easy-shortcuts';
// eslint-disable-next-line import/no-duplicates
import './form';
// eslint-disable-next-line import/no-duplicates
import Form from './form';

@customElement('x-guidemate')
export default class extends LitElement {

  @property({ type: Number }) private errorType: 0;

  @property({ type: Number, attribute: false }) private timerId;

  public constructor() {
    super();
    this.resetError = this.resetError.bind(this);
  }

  public static get styles(): CSSResult {
    return css`
      :host {
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
        color: var(--font-color);
      }

      .guidemate {
        margin-bottom: 20px;
      }

      .primary {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--primary-color);
        border: none;
        width: calc(100% - calc(var(--side-padding) * 2));
        bottom: 60px;
        color: #FFF;
        border-radius: 4px;
        margin: 20px auto;
        font-weight: 500;
        cursor: pointer;
      }

      .contribute {
        width: 100%;
        bottom: 20px;
        font-size: 12px;
        text-align: center;
        color: #474753;
      }

      .error-message-container {
        position: fixed;
        width: 250px;
        left: 35px;
        background-color: #DE5F5A;
        text-align: center;
        padding: 12px;
        color: var(--font-color);
        bottom: 0;
        transform: translate3d(0, 50px, 0);
        transition: all 0.2s ease;
        font-size: 12px;
        border-radius: 4px 4px 0 0;
        font-weight: 500;
      }

      .error-message-container.show {
        transform: translate3d(0, 0px, 0);
      }

      a {
        color: var(--primary-color);
        text-decoration: none;
      }
    `;
  }

  private resetError(): void {
    this.timerId = undefined;
    this.errorType = MessageTypes.UNKNOWN;
  }

  public firstUpdated(): void {
    window.onmessage = ({ data }: any): void => {
      const { type } = data.pluginMessage;
      if (type !== this.errorType) {
        if (!this.timerId) {
          this.errorType = type;
        } else {
          this.timerId = undefined;
          this.errorType = MessageTypes.UNKNOWN;
          window.setTimeout((): void => {
            this.errorType = type;
          }, 400);
        }
        this.timerId = window.setTimeout(this.resetError, 3000);
      }
    };
  }

  /**
   * Retrieves the form value and pass a message to the figma main to add guides with the supplied
   * value.
   */
  public addGuide(): void {
    const form = this.renderRoot.querySelector<Form>('#form');
    const formValue = form.getValues();
    window.parent.postMessage({
      pluginMessage: { type: MessageTypes.ADD_GUIDES, data: formValue },
    }, '*');
  }

  private getErrorMessage(): string {
    switch (this.errorType) {
      case MessageTypes.NO_SELECTION_ERROR:
        return 'No frame or shape selected.';
      case MessageTypes.MULTI_SELECTION_ERROR:
        return 'Multi selection not supported.';
      case MessageTypes.NO_FRAME_ERROR:
        return 'Selected item is not inside a frame.';
      default:
        return null;
    }
  }

  public render(): TemplateResult {
    const errorMessage = this.getErrorMessage();
    return html`
      <div class="guidemate">
        <x-easy-shortcuts></x-easy-shortcuts>
        <x-form id="form"></x-form>
        <div class="error-message-container ${errorMessage ? 'show' : ''}">
          ${errorMessage}
        </div>
        <button class="primary" @click=${this.addGuide}>Add Guides</button>
        <div class="contribute">
          If you enjoy Guide Mate, consider
          <a href="https://www.buymeacoffee.com/cAHgxoB" target="_blank"> buying</a> me a coffee :)
        </div>
      </div>
    `;
  }
}
