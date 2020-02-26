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
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { dataToEditorY } from '../../units';
import hexToRGBA from '../../utils/hexToRGBA';
import { generateFontFamily } from './util';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 */
function TextOutput({
  element: {
    content,
    color,
    backgroundColor,
    backgroundOpacity,
    fontFamily,
    fontFallback,
    fontSize,
    fontWeight,
    fontStyle,
    letterSpacing,
    lineHeight,
    padding,
    textAlign,
    textDecoration,
    textOpacity,
  },
}) {
  const style = {
    fontSize: `${dataToEditorY(fontSize, 100)}%`,
    fontStyle: fontStyle ? fontStyle : null,
    fontFamily: generateFontFamily(fontFamily, fontFallback),
    fontWeight: fontWeight ? fontWeight : null,
    background: backgroundOpacity
      ? hexToRGBA(backgroundColor, backgroundOpacity)
      : backgroundColor,
    color: textOpacity ? hexToRGBA(color, textOpacity) : color,
    lineHeight,
    letterSpacing: isNaN(letterSpacing) ? null : letterSpacing + 'em',
    padding: padding ? `${padding.vertical}% ${padding.horizontal}%` : null,
    textAlign: textAlign ? textAlign : null,
    textDecoration,
    whiteSpace: 'pre-wrap',
  };

  return (
    <p
      className="fill"
      style={style}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

TextOutput.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
};

export default TextOutput;
