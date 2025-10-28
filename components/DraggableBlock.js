import React, { useRef } from 'react';
import { View, PanResponder, Animated, StyleSheet, Dimensions } from 'react-native';
import BlockPreview from './BlockPreview';

const DraggableBlock = ({ block, onDragStart, onDragMove, onDragEnd, isUsed, cellSize }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isUsed,
      onMoveShouldSetPanResponder: () => !isUsed,
      onPanResponderGrant: () => {
        if (!isUsed) {
          onDragStart(block);
          Animated.spring(opacity, {
            toValue: 0.8,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isUsed) {
          pan.setValue({ x: gestureState.dx, y: gestureState.dy });
          onDragMove(evt, gestureState, block);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (!isUsed) {
          const released = onDragEnd(evt, gestureState, block);
          if (released) {
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.parallel([
              Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: true,
              }),
              Animated.spring(opacity, {
                toValue: 1,
                useNativeDriver: true,
              }),
            ]).start();
          }
        }
      },
    })
  ).current;

  if (isUsed) {
    return <View style={[styles.blockContainer, styles.usedBlock]} />;
  }

  return (
    <Animated.View
      style={[
        styles.blockContainer,
        {
          transform: pan.getTranslateTransform(),
          opacity: opacity,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <BlockPreview pattern={block.pattern} size={cellSize * 0.6} color="#4A90E2" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  blockContainer: {
    padding: 15,
    backgroundColor: '#f0f4f8',
    borderRadius: 12,
    margin: 5,
    minWidth: 80,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  usedBlock: {
    opacity: 0.2,
  },
});

export default DraggableBlock;
