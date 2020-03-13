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
import { motion } from 'framer-motion';

function Bounce({ style, children }) {
  return (
    <motion.div
      initial={false}
      style={style}
      animate={{
        scale: [0, 3, 0.5, 1.5, 0.75, 1.25, 0.95, 1.05, 1],
        originX: '50%',
        originY: '50%',
      }}
    >
      {children}
    </motion.div>
  );
}

Bounce.propTypes = {
  style: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Bounce;
