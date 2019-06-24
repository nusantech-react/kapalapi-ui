import React from 'react';
import PropTypes from 'prop-tyoes';
import { Text } from 'react-native';

/**
 * Test Component Description
 */
const Test = text => <Text>{text}</Text>;

Test.propTypes = {
  /* Tes deskripsi props text */
  text: PropTypes.string,
};

export default Test;
