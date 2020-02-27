/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { InputGroup, SelectMenu } from '../../form';
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '../../../constants';
import { useFont } from '../../../app/font';

function FontControls({ properties, state, setState }) {
  const { fontFamily, fontWeight, fontSize } = properties;
  const {
    state: { fonts },
    actions: { getFontWeight, getFontFallback },
  } = useFont();
  return (
    <>
      {fonts && (
        <SelectMenu
          label={__('Font family', 'web-stories')}
          options={fonts}
          value={state.fontFamily}
          isMultiple={fontFamily === ''}
          onChange={(value) => {
            const currentFontWeights = getFontWeight(value);
            const currentFontFallback = getFontFallback(value);
            const fontWeightsArr = currentFontWeights.map(
              ({ thisValue }) => thisValue
            );
            const newFontWeight =
              fontWeightsArr && fontWeightsArr.includes(state.fontWeight)
                ? state.fontWeight
                : 400;
            setState({
              ...state,
              fontFamily: value,
              fontWeight: parseInt(newFontWeight),
              fontWeights: currentFontWeights,
              fontFallback: currentFontFallback,
            });
          }}
        />
      )}
      {state.fontWeights && (
        <SelectMenu
          label={__('Font weight', 'web-stories')}
          options={state.fontWeights}
          value={state.fontWeight}
          isMultiple={fontWeight === ''}
          onChange={(value) =>
            setState({ ...state, fontWeight: parseInt(value) })
          }
        />
      )}
      <InputGroup
        type="number"
        label={__('Font size', 'web-stories')}
        value={state.fontSize}
        isMultiple={fontSize === ''}
        postfix={'px'}
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
        onChange={(value) => setState({ ...state, fontSize: parseInt(value) })}
      />
    </>
  );
}

FontControls.propTypes = {
  properties: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};

export default FontControls;