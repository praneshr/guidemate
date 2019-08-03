import {
  LitElement, customElement, html, TemplateResult, css, CSSResult,
} from 'lit-element';

import './easy-shortcuts';
import Form from './form';

import { MessageTypes } from '../types';

@customElement('x-guidemate')
export default class extends LitElement {
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

      a {
        color: var(--primary-color);
        text-decoration: none;
      }
    `;
  }

  private click_(): void {
    const form = this.renderRoot.querySelector<Form>('#form');
    const formValue = form.getValues();
    parent.postMessage({ pluginMessage: { type: MessageTypes.ADD_GUIDES, data: formValue } }, '*');
  }

  public render(): TemplateResult {
    return html`
      <div class="guidemate">
        <x-easy-shortcuts></x-easy-shortcuts>
        <x-form id="form"></x-form>
        <button class="primary" @click=${this.click_}>Add Guides</button>
        <div class="contribute">
          © 2019 Pranesh Ravi. If you enjoy Guide Mate, consider
          <a href="https://www.buymeacoffee.com/cAHgxoB" target="_blank"> buying</a> me a coffee :)
        </div>
      </div>
    `;
  }
}
