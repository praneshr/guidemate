import {
  LitElement, css, html, customElement, TemplateResult, property, CSSResult,
} from 'lit-element';
import { FormValues, FormInputs } from '../types';

@customElement('x-form-input')
export default class FormInput extends LitElement {
  @property({ type: String }) private placeholder = '';

  @property({ type: Number }) public id;

  public static get styles(): CSSResult {
    return css`
      .form-input {
        display: flex;
        align-items: center;
      }
      input {
        width: 100%;
        background: var(--border-color);
        border: 1px solid var(--border-color);
        border-radius: 2px;
        padding: 5px;
        color: var(--font-color);
      }
      input:focus {
        outline: none;
        border-color: var(--primary-color);
      }
      .input-container {
        margin-left: 10px;
      }
      .icon-container {
        opacity: 1;
      }
    `;
  }

  public getValue(): FormValues {
    const input = this.renderRoot.querySelector('input');
    return {
      id: this.id,
      value: Number(input.value),
    };
  }

  public render(): TemplateResult {
    return html`
      <div class="form-input">
        <div class="icon-container">
          <slot name="icon"></slot>
        </div>
        <div class="input-container">
          <input type="number" placeholder=${this.placeholder}>
        </div>
      </div>
    `;
  }
}
