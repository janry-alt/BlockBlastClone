import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { getTopScores } from '../services/supabase';

const Leaderboard = ({ visible, onClose }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadScores();
    }
  }, [visible]);

  const loadScores = async () => {
    setLoading(true);
    const result = await getTopScores(10);
    if (result.success) {
      setScores(result.data);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Leaderboard</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
            </View>
          ) : scores.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No scores yet. Be the first!</Text>
            </View>
          ) : (
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {scores.map((score, index) => (
                <View
                  key={score.id}
                  style={[
                    styles.scoreRow,
                    index < 3 && styles[`topScore${index + 1}`],
                  ]}
                >
                  <View style={styles.rankContainer}>
                    <Text style={[styles.rank, index < 3 && styles.topRank]}>
                      #{index + 1}
                    </Text>
                  </View>
                  <View style={styles.scoreInfo}>
                    <Text style={styles.playerName} numberOfLines={1}>
                      {score.player_name}
                    </Text>
                    <Text style={styles.scoreDetails}>
                      {score.blocks_placed} blocks • {score.lines_cleared} lines
                    </Text>
                  </View>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreValue}>{score.score}</Text>
                    <Text style={styles.scoreDate}>{formatDate(score.created_at)}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 400,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  topScore1: {
    backgroundColor: '#FFD700',
  },
  topScore2: {
    backgroundColor: '#C0C0C0',
  },
  topScore3: {
    backgroundColor: '#CD7F32',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rank: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topRank: {
    color: '#000',
  },
  scoreInfo: {
    flex: 1,
    marginLeft: 10,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreDetails: {
    color: '#aaa',
    fontSize: 12,
  },
  scoreContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  scoreValue: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scoreDate: {
    color: '#888',
    fontSize: 10,
  },
  closeButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Leaderboard;
