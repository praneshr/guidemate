import {
  LitElement, html, customElement, css, TemplateResult, CSSResult, property,
} from 'lit-element';

import FormInput from './form-input';

import { FormValues, FormInputs } from '../types';

@customElement('x-form')
export default class Form extends LitElement {
  @property({ type: String }) public id = ''

  public static get styles(): CSSResult {
    return css`
      .form {
        padding: var(--side-padding);
      }
      .row {
        margin: 0 calc(-1 * calc(var(--side-padding) / 2));
        display: flex;
        margin-bottom: var(--side-padding);
      }
      .left, .right {
        display: flex;
        flex: 1;
        padding: 0 calc(var(--side-padding) / 2);
      }
    `;
  }

  public getValues(): FormValues[] {
    const formInputs = [...this.renderRoot.querySelectorAll<FormInput>('x-form-input')];
    return formInputs.map((formInput): FormValues => {
      return formInput.getValue();
    });
  }

  public render(): TemplateResult {
    return html`
      <div class="form" id=${this.id}>
        <div class="row">
          <div class="left">
            <x-form-input placeholder="Left margin" id=${FormInputs.LEFT_MARGIN}>
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><title>move-layer-left</title><g fill="#474753"><path d="M1,0A1,1,0,0,0,0,1V11a1,1,0,0,0,2,0V1A1,1,0,0,0,1,0Z" data-color="color-2"></path> <polygon points="9 2 4 6 9 10 9 7 12 7 12 5 9 5 9 2" fill="#474753"></polygon></g></svg>
            </x-form-input>
          </div>
          <div class="right">
            <x-form-input placeholder="Top margin" id=${FormInputs.TOP_MARGIN}>
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><title>move-layer-up</title><g fill="#474753"><path d="M11,0H1A1,1,0,0,0,1,2H11a1,1,0,0,0,0-2Z" data-color="color-2"></path> <polygon points="2 9 5 9 5 12 7 12 7 9 10 9 6 4 2 9" fill="#474753"></polygon></g></svg>
            </x-form-input>
          </div>
        </div>
        <div class="row">
          <div class="left">
            <x-form-input placeholder="Right margin" id=${FormInputs.RIGHT_MARGIN}>
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><title>move-layer-right</title><g fill="#474753"><path d="M11,0a1,1,0,0,0-1,1V11a1,1,0,0,0,2,0V1A1,1,0,0,0,11,0Z" data-color="color-2"></path> <polygon points="3 5 0 5 0 7 3 7 3 10 8 6 3 2 3 5" fill="#474753"></polygon></g></svg>
            </x-form-input>
          </div>
          <div class="right">
            <x-form-input placeholder="Bottom margin" id=${FormInputs.BOTTOM_MARGIN}>
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><title>move-layer-down</title><g fill="#474753"><path d="M11,10H1a1,1,0,0,0,0,2H11a1,1,0,0,0,0-2Z" data-color="color-2"></path> <polygon points="10 3 7 3 7 0 5 0 5 3 2 3 6 8 10 3" fill="#474753"></polygon></g></svg>
            </x-form-input>
          </div>
        </div>
        <div class="row">
          <div class="left">
            <x-form-input placeholder="No. of columns" id=${FormInputs.NO_OF_COLUMNS}>
              <svg slot="icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 12L11 0L9 -8.74228e-08L9 12L11 12Z" fill="#474753"/>
                <path d="M7 12L7 0L5 -8.74228e-08L5 12L7 12Z" fill="#474753"/>
                <path d="M3 12L3 0L1 -8.74228e-08L0.999999 12L3 12Z" fill="#474753"/>
              </svg>
            </x-form-input>
          </div>
          <div class="right">
            <x-form-input placeholder="No. of rows" id=${FormInputs.NO_OF_ROWS}>
              <svg slot="icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1H0V3H12V1Z" fill="#474753"/>
                <path d="M12 5H0V7H12V5Z" fill="#474753"/>
                <path d="M12 9H0V11H12V9Z" fill="#474753"/>
              </svg>
            </x-form-input>
          </div>
        </div>
        <div class="row">
          <div class="left">
            <x-form-input placeholder="Column gutter" id=${FormInputs.VERTICAL_GUTTER}>
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><title>resize-h</title><g fill="#474753"><path d="M.5,0A.5.5,0,0,0,0,.5v11a.5.5,0,0,0,1,0V.5A.5.5,0,0,0,.5,0Z" fill="#474753"></path> <path d="M11.5,0a.5.5,0,0,0-.5.5v11a.5.5,0,0,0,1,0V.5A.5.5,0,0,0,11.5,0Z" fill="#474753"></path> <polygon points="5 9 5 3 1.5 6 5 9" data-color="color-2"></polygon> <polygon points="7 9 7 3 10.5 6 7 9" data-color="color-2"></polygon></g></svg>
            </x-form-input>
          </div>
          <div class="right">
            <x-form-input placeholder="Row gutter" id=${FormInputs.HORIZONTAL_GUTTER}>
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><title>resize-v</title><g fill="#474753"><path d="M12,.5a.5.5,0,0,0-.5-.5H.5a.5.5,0,0,0,0,1h11A.5.5,0,0,0,12,.5Z" fill="#474753"></path> <path d="M12,11.5a.5.5,0,0,0-.5-.5H.5a.5.5,0,0,0,0,1h11A.5.5,0,0,0,12,11.5Z" fill="#474753"></path> <polygon points="3 5 9 5 6 1.5 3 5" data-color="color-2"></polygon> <polygon points="3 7 9 7 6 10.5 3 7" data-color="color-2"></polygon></g></svg>
            </x-form-input>
          </div>
        </div>
      </div>
    `;
  }
}
