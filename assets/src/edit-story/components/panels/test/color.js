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
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../theme';
import createSolid from '../../../utils/createSolid';
import Color from '../color';

function arrange(children = null) {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}

describe('Panels/Color', () => {
  it('should render <Color /> panel', () => {
    const { getByLabelText } = arrange(
      <Color
        selectedElements={[{ color: createSolid(255, 0, 255) }]}
        onSetProperties={() => null}
      />
    );

    const element = getByLabelText(/Color/);
    expect(element).toBeDefined();
    // TODO: Actually verify that the element label is 'Color: FF00FF'
  });
  // TODO: More tests should be defined as soon as we start https://github.com/google/web-stories-wp/issues/378
});
