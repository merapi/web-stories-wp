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
import { useRef } from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../app/config';
import { useMedia } from '../../../../app/media';
import { useMediaPicker } from '../../../mediaPicker';
import useIntersectionEffect from '../../../../utils/useIntersectionEffect';
import { MainButton, Title, SearchInput, Header } from '../../common';
import Dropzone from '../../dropzone';
import useLibrary from '../../useLibrary';
import { Pane } from '../shared';
import paneId from './paneId';
import {
  getResourceFromMediaPicker,
  getResourceFromAttachment,
} from './mediaUtils';
import MediaElement from './mediaElement';

const Container = styled.div`
  grid-area: infinitescroll;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
  overflow: auto;
  padding: 15px 1em 0 1em;
`;

const Column = styled.div``;

const Message = styled.div`
  color: ${({ theme }) => theme.colors.fg.v1};
  font-size: 16px;
  padding: 1em;
`;

const FilterButtons = styled.div`
  border-bottom: 1px solid ${({ theme }) => rgba(theme.colors.fg.v1, 0.1)};
  padding: 18px 0;
  margin: 10px 0 0 0;
`;

const FilterButton = styled.button`
  border: 0;
  background: none;
  padding: 0;
  margin: 0 18px 0 0;
  color: ${({ theme, active }) =>
    active ? theme.colors.fg.v1 : theme.colors.mg.v1};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  font-size: 13px;
  text-transform: uppercase;
`;

const Padding = styled.div`
  grid-area: header;
  padding: 1em 1em 0 1em;
`;

const StyledPane = styled(Pane)`
  height: 100%;
  padding: 0;
  overflow: hidden;
`;

const Inner = styled.div`
  height: 100%;
  display: grid;
  grid:
    'header   ' auto
    'infinitescroll' 1fr
    / 1fr;
`;

const FILTERS = [
  { filter: '', name: __('All', 'web-stories') },
  { filter: 'image', name: __('Images', 'web-stories') },
  { filter: 'video', name: __('Video', 'web-stories') },
];

const DEFAULT_WIDTH = 150;

function MediaPane(props) {
  const {
    state: {
      page,
      hasMore,
      media,
      isMediaLoading,
      isMediaLoaded,
      mediaType,
      searchTerm,
    },
    actions: {
      setPage,
      resetAfterUpload,
      setMediaType,
      setSearchTerm,
      uploadVideoFrame,
    },
  } = useMedia();

  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
  } = useConfig();

  const {
    actions: { insertElement },
  } = useLibrary();

  const onClose = resetAfterUpload;

  /**
   * Callback of select in media picker to insert media element.
   *
   * @param {Object} mediaPickerEl Object coming from backbone media picker.
   */
  const onSelect = (mediaPickerEl) => {
    const resource = getResourceFromMediaPicker(mediaPickerEl);
    const oRatio =
      resource.width && resource.height ? resource.width / resource.height : 1;
    const height = DEFAULT_WIDTH / oRatio;

    insertMediaElement(resource, DEFAULT_WIDTH, height);
  };

  const openMediaPicker = useMediaPicker({
    onSelect,
    onClose,
  });

  /**
   * Handle search term changes.
   *
   * @param {Object} evt Doc Event
   */
  const onSearch = (evt) => {
    setSearchTerm({ searchTerm: evt.target.value });
  };

  /**
   * Filter REST API calls and re-request API.
   *
   * @param {string} filter Value that is passed to rest api to filter.
   */
  const onFilter = (filter) => () => {
    setMediaType({ mediaType: filter });
  };

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} resource Resource object
   * @param {number} width Width that element is inserted into editor.
   * @param {number} height Height that element is inserted into editor.
   * @return {null|*} Return onInsert or null.
   */
  const insertMediaElement = (resource, width, height) => {
    const element = insertElement(resource.type, {
      resource,
      width,
      height,
      x: 5,
      y: 5,
      rotationAngle: 0,
    });

    // Generate video poster if one not set.
    if (resource.type === 'video' && resource.videoId && !resource.posterId) {
      uploadVideoFrame(resource.videoId, resource.src, element.id);
    }

    return element;
  };

  /**
   * Check if number is odd or even.
   *
   * @param {number} n Number
   * @return {boolean} Is even.
   */
  const isEven = (n) => {
    return n % 2 === 0;
  };

  const resources = media
    .filter(
      ({ mimeType }) =>
        allowedImageMimeTypes.includes(mimeType) ||
        allowedVideoMimeTypes.includes(mimeType)
    )
    .map((attachment) => getResourceFromAttachment(attachment));

  const refContainer = useRef();
  const refContainerFooter = useRef();

  useIntersectionEffect(
    refContainerFooter,
    (entry) => {
      if (!isMediaLoaded || isMediaLoading) return;
      if (!hasMore) return;
      if (!entry.isIntersecting) return;

      setPage({ page: page + 1 });
    },
    {
      root: refContainer,
      rootMargin: '0px 0px 0px 0px',
    },
    [page, hasMore, isMediaLoading, isMediaLoaded]
  );

  return (
    <StyledPane id={paneId} {...props}>
      <Dropzone>
        <Inner>
          <Padding>
            <Header>
              <Title>
                {__('Media', 'web-stories')}
                {(!isMediaLoaded || isMediaLoading) && <Spinner />}
              </Title>
              <MainButton onClick={openMediaPicker}>
                {__('Upload', 'web-stories')}
              </MainButton>
            </Header>

            <SearchInput
              value={searchTerm}
              placeholder={__('Search media...', 'web-stories')}
              onChange={onSearch}
            />

            <FilterButtons>
              {FILTERS.map(({ filter, name }, index) => (
                <FilterButton
                  key={index}
                  active={filter === mediaType}
                  onClick={onFilter(filter)}
                >
                  {name}
                </FilterButton>
              ))}
            </FilterButtons>
          </Padding>

          {isMediaLoaded && !media.length ? (
            <Message>{__('No media found', 'web-stories')}</Message>
          ) : (
            <Container ref={refContainer}>
              <Column>
                {resources
                  .filter((_, index) => isEven(index))
                  .map((resource, i) => (
                    <MediaElement
                      resource={resource}
                      key={i}
                      width={DEFAULT_WIDTH}
                      onInsert={insertMediaElement}
                    />
                  ))}
              </Column>
              <Column>
                {resources
                  .filter((_, index) => !isEven(index))
                  .map((resource, i) => (
                    <MediaElement
                      resource={resource}
                      key={i}
                      width={DEFAULT_WIDTH}
                      onInsert={insertMediaElement}
                    />
                  ))}
              </Column>
              {hasMore && <div ref={refContainerFooter}>{'Loading...'}</div>}
            </Container>
          )}
        </Inner>
      </Dropzone>
    </StyledPane>
  );
}

export default MediaPane;
