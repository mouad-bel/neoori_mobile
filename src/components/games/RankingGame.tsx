import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Animated,
  PanResponder,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Game, GameProgress, GameType } from '../../types';
import { useTheme } from '../../store/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import StorageService from '../../services/storage/StorageService';
import AppHeader from '../navigation/AppHeader';
import { BaseGameProps } from './BaseGameInterface';
import CongratulationsModal from '../common/CongratulationsModal';

interface RankingItem {
  id: string;
  label: string;
  description?: string;
}

interface RankingGameProps extends BaseGameProps {
  items: RankingItem[];
  instructions: string;
  question: string;
}

const RankingGame: React.FC<RankingGameProps> = ({ game, onComplete, items, instructions, question }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { colors } = useTheme();
  // Initialize with items if available
  const [rankedItems, setRankedItems] = useState<RankingItem[]>(items.length > 0 ? [...items] : []);
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const itemAnimations = useRef<Record<string, Animated.Value>>({}).current;
  const dragPositions = useRef<Record<string, Animated.ValueXY>>({}).current;
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const dragState = useRef<{
    itemId: string | null;
    startIndex: number;
    startY: number;
    currentIndex: number;
    lastSwapTime: number;
  }>({
    itemId: null,
    startIndex: -1,
    startY: 0,
    currentIndex: -1,
    lastSwapTime: 0,
  });
  const itemLayouts = useRef<Record<string, { y: number; height: number }>>({}).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (progress?.gameData?.rankedItems && progress.gameData.rankedItems.length > 0) {
      setRankedItems(progress.gameData.rankedItems);
    } else if (items.length > 0 && rankedItems.length === 0) {
      // Initialize with original order only if we have items and rankedItems is empty
      setRankedItems([...items]);
    }
  }, [progress]);

  const loadProgress = async () => {
    try {
      const savedProgress = await StorageService.getGameProgress(game.id);
      if (savedProgress && !savedProgress.completed && savedProgress.gameData?.rankedItems?.length > 0) {
        setProgress(savedProgress);
      } else {
        // Initialize with items if available
        const initialItems = items.length > 0 ? [...items] : [];
        const newProgress: GameProgress = {
          gameId: game.id,
          gameType: 'ranking' as GameType,
          gameData: {
            rankedItems: initialItems,
          },
          startedAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
          completed: false,
        };
        setProgress(newProgress);
        // Also set rankedItems directly
        if (initialItems.length > 0) {
          setRankedItems(initialItems);
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      // Fallback: initialize with items
      if (items.length > 0) {
        setRankedItems([...items]);
      }
    }
  };

  const saveProgress = async (gameData: any, completed: boolean = false) => {
    try {
      const updatedProgress: GameProgress = {
        gameId: game.id,
        gameType: 'ranking' as GameType,
        gameData,
        startedAt: progress?.startedAt || new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        completed,
      };
      await StorageService.saveGameProgress(updatedProgress);
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const getItemAnimation = (itemId: string) => {
    if (!itemAnimations[itemId]) {
      itemAnimations[itemId] = new Animated.Value(1);
    }
    return itemAnimations[itemId];
  };

  const getDragPosition = (itemId: string) => {
    if (!dragPositions[itemId]) {
      dragPositions[itemId] = new Animated.ValueXY();
    }
    return dragPositions[itemId];
  };

  const handleItemLayout = (itemId: string, event: any) => {
    const { y, height } = event.nativeEvent.layout;
    const oldLayout = itemLayouts[itemId];
    
    // Only update if layout actually changed to avoid unnecessary updates
    if (!oldLayout || Math.abs(oldLayout.y - y) > 0.5 || Math.abs(oldLayout.height - height) > 0.5) {
      itemLayouts[itemId] = { y, height };
      
      // Debug log for significant layout changes
      if (oldLayout && (Math.abs(oldLayout.y - y) > 5 || Math.abs(oldLayout.height - height) > 5)) {
        console.log('Layout updated:', {
          itemId,
          oldY: oldLayout.y.toFixed(2),
          newY: y.toFixed(2),
          oldHeight: oldLayout.height.toFixed(2),
          newHeight: height.toFixed(2),
          isDragging: dragState.current.itemId === itemId,
        });
      }
    }
  };

  const startDrag = (itemId: string, index: number, startY: number) => {
    dragState.current = {
      itemId,
      startIndex: index,
      startY,
      currentIndex: index,
      lastSwapTime: 0,
    };
    setDraggedItemId(itemId);
    const anim = getItemAnimation(itemId);
    Animated.spring(anim, {
      toValue: 1.05,
      tension: 300,
      friction: 20,
      useNativeDriver: true,
    }).start();
  };

  const updateDrag = (itemId: string, dy: number) => {
    if (dragState.current.itemId !== itemId) return;
    
    const dragPos = getDragPosition(itemId);
    // Keep dragged item at its drag position (dy)
    dragPos.setValue({ x: 0, y: dy });
    
    // Find original index (where the item started)
    const originalIndex = dragState.current.startIndex;
    if (originalIndex === -1) return;
    
    const itemLayout = itemLayouts[itemId];
    if (!itemLayout) return;
    
    // Calculate the center position of the dragged item
    const draggedItemCenter = itemLayout.y + dy + itemLayout.height / 2;
    
    // Find which position we're hovering over (target index)
    let targetIndex = originalIndex;
    
    // Check items above (moving up)
    if (dy < 0) {
      for (let i = originalIndex - 1; i >= 0; i--) {
        const otherItem = rankedItems[i];
        const otherLayout = itemLayouts[otherItem.id];
        if (!otherLayout) continue;
        
        const otherCenter = otherLayout.y + otherLayout.height / 2;
        // If dragged item center passes above the middle of another item
        if (draggedItemCenter < otherCenter) {
          targetIndex = i;
          break;
        }
      }
    }
    
    // Check items below (moving down)
    if (dy > 0) {
      for (let i = originalIndex + 1; i < rankedItems.length; i++) {
        const otherItem = rankedItems[i];
        const otherLayout = itemLayouts[otherItem.id];
        if (!otherLayout) continue;
        
        const otherCenter = otherLayout.y + otherLayout.height / 2;
        // If dragged item center passes below the middle of another item
        if (draggedItemCenter > otherCenter) {
          targetIndex = i;
        } else {
          break; // Stop if we haven't passed the center
        }
      }
    }
    
    // If target index changed, animate other items to make space
    if (targetIndex !== dragState.current.currentIndex) {
      const lastSwapTime = dragState.current.lastSwapTime || 0;
      const now = Date.now();
      if (now - lastSwapTime < 50) return; // Debounce
      
      dragState.current.currentIndex = targetIndex;
      dragState.current.lastSwapTime = now;
      
      console.log('Target index changed:', {
        itemId,
        originalIndex,
        targetIndex,
        dy: dy.toFixed(2),
      });
      
      // Calculate which items need to move and animate them
      const startIdx = Math.min(originalIndex, targetIndex);
      const endIdx = Math.max(originalIndex, targetIndex);
      
      // Animate other items to their new positions
      rankedItems.forEach((item, index) => {
        if (item.id === itemId) return; // Skip dragged item
        
        let newIndex = index;
        
        // Calculate new index based on target position
        if (targetIndex < originalIndex) {
          // Moving up: items between target and original move down
          if (index >= targetIndex && index < originalIndex) {
            newIndex = index + 1;
          }
        } else if (targetIndex > originalIndex) {
          // Moving down: items between original and target move up
          if (index > originalIndex && index <= targetIndex) {
            newIndex = index - 1;
          }
        }
        
        // If item needs to move, animate it
        if (newIndex !== index) {
          const itemLayout = itemLayouts[item.id];
          if (!itemLayout) return;
          
          // Calculate offset based on item height and spacing
          const itemHeight = itemLayout.height;
          const spacing = 16; // margin between items
          const indexDiff = newIndex - index;
          const offset = indexDiff * (itemHeight + spacing);
          
          const itemDragPos = getDragPosition(item.id);
          
          // Animate the item to its new position
          Animated.spring(itemDragPos, {
            toValue: { x: 0, y: offset },
            tension: 300,
            friction: 25,
            useNativeDriver: true,
          }).start();
        }
      });
      
      // Update the array order (but keep dragged item visually at drag position)
      const newItems = [...rankedItems];
      const draggedItem = newItems[originalIndex];
      newItems.splice(originalIndex, 1);
      newItems.splice(targetIndex, 0, draggedItem);
      setRankedItems(newItems);
    }
  };

  const endDrag = (itemId: string) => {
    if (dragState.current.itemId !== itemId) return;
    
    const finalIndex = dragState.current.currentIndex;
    console.log('End drag:', {
      itemId,
      finalIndex,
    });
    
    // Reset all items' drag positions (they should already be in their new positions)
    rankedItems.forEach((item) => {
      const itemDragPos = getDragPosition(item.id);
      Animated.spring(itemDragPos, {
        toValue: { x: 0, y: 0 },
        tension: 300,
        friction: 25,
        useNativeDriver: true,
      }).start();
    });
    
    const dragPos = getDragPosition(itemId);
    const anim = getItemAnimation(itemId);
    
    // Smoothly reset dragged item position to 0 (it's now in its final position)
    Animated.parallel([
      Animated.spring(dragPos, {
        toValue: { x: 0, y: 0 },
        tension: 300,
        friction: 25,
        useNativeDriver: true,
      }),
      Animated.spring(anim, {
        toValue: 1,
        tension: 300,
        friction: 25,
        useNativeDriver: true,
      }),
    ]).start(() => {
      saveProgress({ rankedItems });
      setDraggedItemId(null);
      dragState.current = {
        itemId: null,
        startIndex: -1,
        startY: 0,
        currentIndex: -1,
        lastSwapTime: 0,
      };
    });
  };

  const longPressTimers = useRef<Record<string, NodeJS.Timeout>>({}).current;
  const touchStartTime = useRef<Record<string, number>>({}).current;


  const createPanResponder = (itemId: string, index: number) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => {
        // Don't block, but allow to start if dragging
        return dragState.current.itemId === itemId;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only capture if already dragging
        return dragState.current.itemId === itemId;
      },
      onPanResponderGrant: () => {
        // Reset position when starting drag
        if (dragState.current.itemId === itemId) {
          const dragPos = getDragPosition(itemId);
          dragPos.setValue({ x: 0, y: 0 });
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        // Update drag if active
        if (dragState.current.itemId === itemId) {
          // Clamp dy to prevent extreme values
          const clampedDy = Math.max(-1000, Math.min(1000, gestureState.dy));
          updateDrag(itemId, clampedDy);
        }
      },
      onPanResponderRelease: () => {
        // Cancel long press timer
        if (longPressTimers[itemId]) {
          clearTimeout(longPressTimers[itemId]);
          delete longPressTimers[itemId];
        }
        if (dragState.current.itemId === itemId) {
          endDrag(itemId);
        }
      },
      onPanResponderTerminate: () => {
        // Cancel long press timer
        if (longPressTimers[itemId]) {
          clearTimeout(longPressTimers[itemId]);
          delete longPressTimers[itemId];
        }
        if (dragState.current.itemId === itemId) {
          const dragPos = getDragPosition(itemId);
          const anim = getItemAnimation(itemId);
          Animated.parallel([
            Animated.spring(dragPos, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true,
            }),
            Animated.spring(anim, {
              toValue: 1,
              useNativeDriver: true,
            }),
          ]).start();
          setDraggedItemId(null);
          dragState.current = {
            itemId: null,
            startIndex: -1,
            startY: 0,
            currentIndex: -1,
          };
        }
      },
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...rankedItems];
    let movedItemId: string | null = null;
    
    if (direction === 'up' && index > 0) {
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      movedItemId = newItems[index - 1].id;
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      movedItemId = newItems[index + 1].id;
    }
    
    if (movedItemId) {
      const anim = getItemAnimation(movedItemId);
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(anim, {
          toValue: 1,
          tension: 200,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    setRankedItems(newItems);
    saveProgress({ rankedItems: newItems });
  };

  const handleComplete = async () => {
    await saveProgress({ rankedItems }, true);
    setShowCongratulations(true);
  };

  const handleCongratulationsClose = () => {
    setShowCongratulations(false);
    onComplete();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        title={game.title}
        showLogo={true}
        showNotifications={false}
        showChat={false}
        showProfile={false}
      />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={draggedItemId === null}
      >
        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={[styles.instructionsText, { color: colors.textPrimary }]}>
            {instructions}
          </Text>
        </View>

        {/* Question */}
        <View style={styles.questionSection}>
          <Text style={[styles.questionText, { color: colors.textPrimary }]}>
            {question}
          </Text>
        </View>

        {/* Ranking List */}
        <View style={styles.rankingSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Tiens longuement et glisse pour réorganiser (du plus important au moins important)
          </Text>
          {rankedItems.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.cardBackground }]}>
              <Ionicons name="list-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                Chargement des éléments...
              </Text>
            </View>
          ) : (
            <View>
              {rankedItems.map((item, index) => {
                const anim = getItemAnimation(item.id);
                const dragPos = getDragPosition(item.id);
                const panResponder = createPanResponder(item.id, index);
                const isDragging = draggedItemId === item.id;
                
                return (
                    <Animated.View
                      key={item.id}
                      style={[
                        {
                          transform: [
                            { scale: anim },
                            { translateY: dragPos.y },
                          ],
                          zIndex: isDragging ? 1000 : 1,
                          opacity: isDragging ? 0.95 : 1,
                        },
                      ]}
                      onLayout={(event) => {
                        handleItemLayout(item.id, event);
                      }}
                      {...panResponder.panHandlers}
                    >
                      <Pressable
                        onLongPress={() => {
                          if (!dragState.current.itemId) {
                            startDrag(item.id, index, 0);
                          }
                        }}
                        delayLongPress={400}
                        style={[
                          styles.rankingItem,
                          {
                            backgroundColor: colors.cardBackground,
                            borderColor: isDragging ? colors.primary : colors.background,
                            borderWidth: isDragging ? 3 : 2,
                            elevation: isDragging ? 8 : 2,
                            shadowOpacity: isDragging ? 0.3 : 0.1,
                          },
                        ]}
                      >
                      <View style={styles.rankNumber}>
                        <Text style={[styles.rankNumberText, { color: colors.primary }]}>
                          {index + 1}
                        </Text>
                      </View>
                      <View style={styles.itemContent}>
                        <Text style={[styles.itemLabel, { color: colors.textPrimary }]}>
                          {item.label}
                        </Text>
                        {item.description && (
                          <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>
                            {item.description}
                          </Text>
                        )}
                      </View>
                      <View style={styles.controls}>
                        <TouchableOpacity
                          style={[
                            styles.controlButton,
                            {
                              backgroundColor: index === 0 ? colors.background : colors.primary,
                              opacity: index === 0 ? 0.3 : 1,
                            },
                          ]}
                          onPress={() => moveItem(index, 'up')}
                          disabled={index === 0}
                        >
                          <Ionicons
                            name="chevron-up"
                            size={20}
                            color={index === 0 ? colors.textSecondary : colors.background}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.controlButton,
                            {
                              backgroundColor: index === rankedItems.length - 1 ? colors.background : colors.primary,
                              opacity: index === rankedItems.length - 1 ? 0.3 : 1,
                            },
                          ]}
                          onPress={() => moveItem(index, 'down')}
                          disabled={index === rankedItems.length - 1}
                        >
                          <Ionicons
                            name="chevron-down"
                            size={20}
                            color={index === rankedItems.length - 1 ? colors.textSecondary : colors.background}
                          />
                        </TouchableOpacity>
                      </View>
                      </Pressable>
                    </Animated.View>
                );
              })}
            </View>
          )}
        </View>

        {/* Complete Button */}
        <TouchableOpacity
          style={[styles.completeButton, { backgroundColor: colors.primary }]}
          onPress={handleComplete}
        >
          <Text style={[styles.completeButtonText, { color: colors.background }]}>
            Terminer le classement
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <CongratulationsModal
        visible={showCongratulations}
        onClose={handleCongratulationsClose}
        title="Félicitations ! 🎉"
        message={`Tu as terminé "${game.title}" avec succès !`}
        delay={2000}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingTop: 100,
    paddingBottom: SPACING.xxl,
  },
  instructionsSection: {
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  instructionsText: {
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
    textAlign: 'center',
  },
  questionSection: {
    marginBottom: SPACING.xl,
  },
  questionText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    lineHeight: 32,
    textAlign: 'center',
  },
  rankingSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  rankNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumberText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  itemDescription: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 18,
  },
  controls: {
    gap: SPACING.xs,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  completeButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  emptyState: {
    padding: SPACING.xxl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  emptyStateText: {
    fontSize: FONTS.sizes.md,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});

export default RankingGame;
