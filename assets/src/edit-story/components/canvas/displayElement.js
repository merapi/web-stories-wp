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
import styled from 'styled-components';
import { useRef, useState } from 'react';

/**
 * Internal dependencies
 */
import { getDefinitionForType } from '../../elements';
import {
  elementWithPosition,
  elementWithSize,
  elementWithRotation,
} from '../../elements/shared';
import StoryPropTypes from '../../types';
import { useTransformHandler } from '../transform';
import { useUnits } from '../../units';
import WithMask from '../../masks/display';

const Wrapper = styled.div`
	${elementWithPosition}
	${elementWithSize}
	${elementWithRotation}
	contain: layout paint;
`;

function DisplayElement({ element }) {
  const {
    actions: { getBox },
  } = useUnits();

  const [replacement, setReplacement] = useState(null);

  const replacementElement = replacement
    ? {
        ...element,
        type: replacement.type,
        resource: replacement,
      }
    : null;

  const { id, opacity, type } = element;
  const { Display } = getDefinitionForType(type);
  const { Display: Replacement } =
    getDefinitionForType(replacement?.type) || {};

  const wrapperRef = useRef(null);

  const box = getBox(element);

  useTransformHandler(id, (transform) => {
    const target = wrapperRef.current;
    if (transform === null) {
      target.style.transform = '';
      target.style.width = '';
      target.style.height = '';
      target.style.opacity = 1;
    } else {
      const { translate, rotate, resize, dropTargets } = transform;
      target.style.transform = `translate(${translate?.[0]}px, ${translate?.[1]}px) rotate(${rotate}deg)`;
      if (resize && resize[0] !== 0 && resize[1] !== 0) {
        target.style.width = `${resize[0]}px`;
        target.style.height = `${resize[1]}px`;
      }
      if (typeof dropTargets?.hover !== 'undefined') {
        target.style.opacity = dropTargets.hover ? 0.6 : 1;
      }
      if (typeof dropTargets?.replacement !== 'undefined') {
        setReplacement(dropTargets.replacement || null);
      }
    }
  });

  return (
    <Wrapper ref={wrapperRef} {...box}>
      <WithMask
        element={element}
        fill={true}
        box={box}
        style={{
          opacity: opacity ? opacity / 100 : null,
        }}
      >
        <Display element={element} box={box} />
        {replacementElement && (
          <Replacement element={replacementElement} box={box} />
        )}
      </WithMask>
    </Wrapper>
  );
}

DisplayElement.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default DisplayElement;
