import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { BaseGameProps } from './BaseGameInterface';
import { useTheme } from '../../store/ThemeContext';
import { FONTS, SPACING, BORDER_RADIUS, COLORS } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOARD_PADDING = SPACING.lg;
const BOARD_MARGIN = SPACING.md;
const AVAILABLE_WIDTH = SCREEN_WIDTH - BOARD_PADDING * 2 - BOARD_MARGIN * 2;
const COLUMNS = 7;
const ROWS = 6;
const CELL_SIZE = Math.floor((AVAILABLE_WIDTH - SPACING.sm * (COLUMNS - 1)) / COLUMNS);
const PIECE_SIZE = CELL_SIZE * 0.85;
const ANIMATION_DURATION = 400;

type Player = 1 | 2;
type CellValue = 0 | Player;
type GameMode = 'ai' | 'offline' | 'online';

interface GameState {
  board: CellValue[][];
  currentPlayer: Player;
  winner: Player | null;
  gameOver: boolean;
  isAITurn: boolean;
  winningCells: Array<{ row: number; col: number }>;
  player1Name: string;
  player2Name: string;
}

// Minimax AI with alpha-beta pruning
class ConnectFourAI {
  private static readonly DEPTH = 6;
  private static readonly PLAYER_2 = 2;
  private static readonly PLAYER_1 = 1;

  static evaluate(board: CellValue[][], player: Player): number {
    let score = 0;
    const opponent = player === 1 ? 2 : 1;

    // Evaluate all possible lines (horizontal, vertical, diagonal)
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal \
      [1, -1],  // diagonal /
    ];

    for (const [dx, dy] of directions) {
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
          const lineScore = this.evaluateLine(board, row, col, dx, dy, player, opponent);
          score += lineScore;
        }
      }
    }

    return score;
  }

  private static evaluateLine(
    board: CellValue[][],
    row: number,
    col: number,
    dx: number,
    dy: number,
    player: Player,
    opponent: Player
  ): number {
    let playerCount = 0;
    let opponentCount = 0;
    let emptyCount = 0;

    for (let i = 0; i < 4; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;

      if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLUMNS) {
        return 0;
      }

      const cell = board[newRow][newCol];
      if (cell === player) playerCount++;
      else if (cell === opponent) opponentCount++;
      else emptyCount++;
    }

    if (opponentCount > 0) return 0; // Blocked line

    // Scoring based on potential
    if (playerCount === 4) return 100000; // Win
    if (playerCount === 3 && emptyCount === 1) return 1000; // Three in a row
    if (playerCount === 2 && emptyCount === 2) return 100; // Two in a row
    if (playerCount === 1 && emptyCount === 3) return 10; // One in a row

    return 0;
  }

  static minimax(
    board: CellValue[][],
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean
  ): number {
    // Check for terminal states
    const winner = this.checkWinner(board);
    if (winner === this.PLAYER_2) return 10000 + depth;
    if (winner === this.PLAYER_1) return -10000 - depth;
    if (this.isBoardFull(board) || depth === 0) {
      return this.evaluate(board, this.PLAYER_2);
    }

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (let col = 0; col < COLUMNS; col++) {
        const newBoard = this.makeMove(board, col, this.PLAYER_2);
        if (newBoard) {
          const evalScore = this.minimax(newBoard, depth - 1, alpha, beta, false);
          maxEval = Math.max(maxEval, evalScore);
          alpha = Math.max(alpha, evalScore);
          if (beta <= alpha) break; // Alpha-beta pruning
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let col = 0; col < COLUMNS; col++) {
        const newBoard = this.makeMove(board, col, this.PLAYER_1);
        if (newBoard) {
          const evalScore = this.minimax(newBoard, depth - 1, alpha, beta, true);
          minEval = Math.min(minEval, evalScore);
          beta = Math.min(beta, evalScore);
          if (beta <= alpha) break; // Alpha-beta pruning
        }
      }
      return minEval;
    }
  }

  static makeMove(board: CellValue[][], column: number, player: Player): CellValue[][] | null {
    const newBoard = board.map(row => [...row]);
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][column] === 0) {
        newBoard[row][column] = player;
        return newBoard;
      }
    }
    return null;
  }

  static checkWinner(board: CellValue[][]): Player | null {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal \
      [1, -1],  // diagonal /
    ];

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        const cell = board[row][col];
        if (cell === 0) continue;

        for (const [dx, dy] of directions) {
          let count = 1;
          for (let i = 1; i < 4; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            if (
              newRow >= 0 &&
              newRow < ROWS &&
              newCol >= 0 &&
              newCol < COLUMNS &&
              board[newRow][newCol] === cell
            ) {
              count++;
            } else {
              break;
            }
          }
          if (count === 4) {
            return cell as Player;
          }
        }
      }
    }
    return null;
  }

  static isBoardFull(board: CellValue[][]): boolean {
    return board[0].every(cell => cell !== 0);
  }

  static getBestMove(board: CellValue[][]): number {
    let bestScore = -Infinity;
    let bestMove = Math.floor(COLUMNS / 2); // Start with center column

    // Check for immediate wins
    for (let col = 0; col < COLUMNS; col++) {
      const testBoard = this.makeMove(board, col, this.PLAYER_2);
      if (testBoard && this.checkWinner(testBoard) === this.PLAYER_2) {
        return col;
      }
    }

    // Check for blocking opponent wins
    for (let col = 0; col < COLUMNS; col++) {
      const testBoard = this.makeMove(board, col, this.PLAYER_1);
      if (testBoard && this.checkWinner(testBoard) === this.PLAYER_1) {
        return col;
      }
    }

    // Use minimax for best move
    for (let col = 0; col < COLUMNS; col++) {
      const testBoard = this.makeMove(board, col, this.PLAYER_2);
      if (testBoard) {
        const score = this.minimax(testBoard, this.DEPTH - 1, -Infinity, Infinity, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = col;
        }
      }
    }

    return bestMove;
  }
}

const ConnectFourGame: React.FC<BaseGameProps> = ({ game, onComplete }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { colors } = useTheme();
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [player1Name, setPlayer1Name] = useState('Joueur 1');
  const [player2Name, setPlayer2Name] = useState('Joueur 2');
  const [gameState, setGameState] = useState<GameState>({
    board: Array(ROWS).fill(null).map(() => Array(COLUMNS).fill(0) as CellValue[]),
    currentPlayer: 1,
    winner: null,
    gameOver: false,
    isAITurn: false,
    winningCells: [],
    player1Name: 'Joueur 1',
    player2Name: 'Joueur 2',
  });

  const pieceAnimations = useRef<Record<string, Animated.Value>>({}).current;
  const dropAnimations = useRef<Record<string, Animated.ValueXY>>({}).current;
  const wsRef = useRef<WebSocket | null>(null); // For online mode
  const onlineMatchIdRef = useRef<string | null>(null);
  const playerIdRef = useRef<string | null>(null);
  const isHostRef = useRef<boolean>(false);
  const [onlineStatus, setOnlineStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'waiting' | 'ready'>('disconnected');
  const [showOnlineModal, setShowOnlineModal] = useState(false);
  
  // Debug modal visibility
  useEffect(() => {
    console.log('[ConnectFour] Modal visibility changed:', showOnlineModal, 'matchId:', matchIdToShare, 'status:', onlineStatus);
  }, [showOnlineModal, matchIdToShare, onlineStatus]);
  const [matchIdInput, setMatchIdInput] = useState('');
  const [matchIdToShare, setMatchIdToShare] = useState('');
  
  // WebSocket server endpoint (use production server or configure your own)
  // For production, use: 'wss://c4-server.fly.dev/'
  // For local development with server: 'ws://localhost:8080'
  const WS_SERVER = 'wss://c4-server.fly.dev/';

  // Initialize board
  const initializeBoard = (mode: GameMode, p1Name?: string, p2Name?: string) => {
    const newBoard: CellValue[][] = Array(ROWS)
      .fill(null)
      .map(() => Array(COLUMNS).fill(0) as CellValue[]);
    
    setGameState({
      board: newBoard,
      currentPlayer: 1,
      winner: null,
      gameOver: false,
      isAITurn: mode === 'ai' ? false : false, // AI will make first move if needed
      winningCells: [],
      player1Name: p1Name || 'Joueur 1',
      player2Name: p2Name || (mode === 'ai' ? 'IA' : 'Joueur 2'),
    });

    setGameMode(mode);
  };

  // Start game with selected mode
  const startGame = (mode: GameMode) => {
    if (mode === 'online') {
      initializeOnlineGame();
    } else {
      initializeBoard(mode, player1Name, player2Name);
    }
  };

  // Check for winner and find winning cells
  const checkWinner = (board: CellValue[][], row: number, col: number, player: Player): { won: boolean; cells: Array<{ row: number; col: number }> } => {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal \
      [1, -1],  // diagonal /
    ];

    for (const [dx, dy] of directions) {
      const cells: Array<{ row: number; col: number }> = [{ row, col }];
      
      // Check positive direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        if (
          newRow >= 0 &&
          newRow < ROWS &&
          newCol >= 0 &&
          newCol < COLUMNS &&
          board[newRow][newCol] === player
        ) {
          cells.push({ row: newRow, col: newCol });
        } else {
          break;
        }
      }

      // Check negative direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
        if (
          newRow >= 0 &&
          newRow < ROWS &&
          newCol >= 0 &&
          newCol < COLUMNS &&
          board[newRow][newCol] === player
        ) {
          cells.push({ row: newRow, col: newCol });
        } else {
          break;
        }
      }

      if (cells.length >= 4) {
        return { won: true, cells: cells.slice(0, 4) };
      }
    }

    return { won: false, cells: [] };
  };

  // Check if board is full
  const isBoardFull = (board: CellValue[][]): boolean => {
    return board[0].every(cell => cell !== 0);
  };

  // Drop piece in column with animation
  const dropPiece = (column: number, player: Player, animated: boolean = true): { row: number; success: boolean } => {
    const newBoard = gameState.board.map(row => [...row]);
    
    // Find the lowest empty row in the column
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][column] === 0) {
        newBoard[row][column] = player;
        
        // Check for winner
        const winnerCheck = checkWinner(newBoard, row, column, player);
        const winner = winnerCheck.won ? player : null;
        const gameOver = winner !== null || isBoardFull(newBoard);

        // Animate piece drop
        if (animated) {
          const key = `${row}-${column}`;
          if (!dropAnimations[key]) {
            dropAnimations[key] = new Animated.ValueXY({ x: 0, y: -CELL_SIZE * (row + 2) });
          }
          dropAnimations[key].setValue({ x: 0, y: -CELL_SIZE * (row + 2) });
          
          Animated.spring(dropAnimations[key], {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
        }

        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: player === 1 ? 2 : 1,
          winner,
          gameOver,
          isAITurn: !gameOver && gameMode === 'ai' && player === 1, // Only AI turn in AI mode after player 1 moves
          winningCells: winnerCheck.cells,
        }));

        return { row, success: true };
      }
    }

    return { row: -1, success: false };
  };

  // AI move (only in AI mode)
  useEffect(() => {
    if (gameMode === 'ai' && gameState.isAITurn && !gameState.gameOver) {
      const timer = setTimeout(() => {
        const bestMove = ConnectFourAI.getBestMove(gameState.board);
        dropPiece(bestMove, 2, true);
      }, 200); // Fast AI response for better gameplay

      return () => clearTimeout(timer);
    }
  }, [gameMode, gameState.isAITurn, gameState.gameOver]);

  // WebSocket message types (matching original game)
  const MESSAGE_TYPE = {
    NEW_PLAYER_CONNECTION_REQUEST: 'NEW_PLAYER_CONNECTION_REQUEST',
    NEW_PLAYER_CONNECTION_OK: 'NEW_PLAYER_CONNECTION_OK',
    NEW_MATCH_REQUEST: 'NEW_MATCH_REQUEST',
    NEW_MATCH_OK: 'NEW_MATCH_OK',
    CONNECT_MATCH_REQUEST: 'CONNECT_MATCH_REQUEST',
    CONNECT_MATCH_OK: 'CONNECT_MATCH_OK',
    CONNECT_MATCH_FAIL: 'CONNECT_MATCH_FAIL',
    GAME_READY: 'GAME_READY',
    MOVE_MAIN: 'MOVE_MAIN',
    MOVE_SHADOW: 'MOVE_SHADOW',
    GAME_ENDED: 'GAME_ENDED',
    OTHER_PLAYER_HUNGUP: 'OTHER_PLAYER_HUNGUP',
  };

  // Construct WebSocket message
  const constructMessage = (type: string, payload?: any): string => {
    return JSON.stringify({ type, payload });
  };

  // Parse WebSocket message
  const parseMessage = (data: string): any => {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  };

  // Initialize WebSocket connection
  const initWebSocketConnection = (isHost: boolean, matchIdToJoin?: string) => {
    console.log('[ConnectFour] Initializing WebSocket, isHost:', isHost, 'matchId:', matchIdToJoin);
    setOnlineStatus('connecting');
    
    try {
      console.log('[ConnectFour] Connecting to:', WS_SERVER);
      const ws = new WebSocket(WS_SERVER);
      wsRef.current = ws;
      isHostRef.current = isHost;

      ws.onopen = () => {
        console.log('[WebSocket] Connected successfully');
        setOnlineStatus('connected');
        // Send connection request
        const connectionMessage = constructMessage(MESSAGE_TYPE.NEW_PLAYER_CONNECTION_REQUEST, {
          playerName: player1Name,
        });
        console.log('[WebSocket] Sending connection request:', connectionMessage);
        ws.send(connectionMessage);
      };

      ws.onmessage = (event) => {
        console.log('[WebSocket] Message received:', event.data);
        const message = parseMessage(event.data);
        if (!message) {
          console.log('[WebSocket] Failed to parse message');
          return;
        }
        console.log('[WebSocket] Parsed message:', message);
        handleWebSocketMessage(message, matchIdToJoin);
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        setOnlineStatus('disconnected');
        // Keep modal open so user can retry (for both creating and joining)
        Alert.alert(
          'Erreur de connexion', 
          'Impossible de se connecter au serveur.\n\nLe serveur pourrait être indisponible. Vérifiez votre connexion internet ou réessayez plus tard.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear inputs for retry
                if (!matchIdToShare) {
                  setMatchIdInput('');
                }
              },
            },
          ]
        );
      };

      ws.onclose = (event) => {
        console.log('[WebSocket] Disconnected, code:', event.code, 'reason:', event.reason);
        setOnlineStatus('disconnected');
        if (event.code !== 1000) { // Not a normal closure
          // Keep modal open so user can retry
          Alert.alert(
            'Connexion fermée', 
            'La connexion au serveur a été fermée.\n\nVous pouvez réessayer.',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (!matchIdToShare) {
                    setMatchIdInput(''); // Clear for retry
                  }
                },
              },
            ]
          );
        }
      };

      // Timeout if connection takes too long
      setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.log('[WebSocket] Connection timeout');
          ws.close();
          setOnlineStatus('disconnected');
          // Keep modal open so user can retry
          Alert.alert(
            'Timeout de connexion',
            'Le serveur ne répond pas. Il pourrait être indisponible.\n\nEssayez de créer votre propre serveur ou utilisez le mode local.',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (!matchIdToShare) {
                    setMatchIdInput(''); // Clear for retry
                  }
                },
              },
            ]
          );
        }
      }, 10000); // 10 second timeout

    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      setOnlineStatus('disconnected');
      setShowOnlineModal(false);
      Alert.alert('Erreur', 'Impossible de créer la connexion WebSocket: ' + (error as Error).message);
    }
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = (message: any, matchIdToJoin?: string) => {
    switch (message.type) {
      case MESSAGE_TYPE.NEW_PLAYER_CONNECTION_OK:
        playerIdRef.current = message.payload.playerId;
        if (isHostRef.current) {
          // Host creates a new match
          wsRef.current?.send(constructMessage(MESSAGE_TYPE.NEW_MATCH_REQUEST, {
            playerId: playerIdRef.current,
          }));
        } else if (matchIdToJoin) {
          // Joining player connects to match
          wsRef.current?.send(constructMessage(MESSAGE_TYPE.CONNECT_MATCH_REQUEST, {
            playerId: playerIdRef.current,
            matchId: matchIdToJoin,
          }));
        }
        break;

      case MESSAGE_TYPE.NEW_MATCH_OK:
        console.log('[ConnectFour] Match created, ID:', message.payload.matchId);
        onlineMatchIdRef.current = message.payload.matchId;
        const matchId = message.payload.matchId;
        
        // Update state
        setMatchIdToShare(matchId);
        setOnlineStatus('waiting');
        setShowOnlineModal(true);
        
        // Show Alert with copy option
        Alert.alert(
          'Partie créée ! 🎮',
          `ID de la partie:\n${matchId}\n\nPartagez cet ID avec votre ami pour qu'il puisse vous rejoindre.`,
          [
            {
              text: 'Copier l\'ID',
              onPress: async () => {
                await Clipboard.setStringAsync(matchId);
                Alert.alert('Copié !', 'L\'ID a été copié dans le presse-papiers.');
              },
            },
            {
              text: 'Fermer',
              onPress: () => {
                // Allow closing modal after creating match
                setShowOnlineModal(false);
              },
              style: 'cancel',
            },
          ]
        );
        
        console.log('[ConnectFour] Modal should be visible now, matchId:', matchId);
        break;

      case MESSAGE_TYPE.CONNECT_MATCH_OK:
        onlineMatchIdRef.current = message.payload.matchId;
        setOnlineStatus('ready');
        setShowOnlineModal(false);
        setMatchIdInput(''); // Clear input
        initializeBoard('online', player1Name, 'Joueur 2');
        Alert.alert('Partie rejointe ! 🎮', 'Vous êtes maintenant connecté. La partie va commencer.');
        break;

      case MESSAGE_TYPE.CONNECT_MATCH_FAIL:
        Alert.alert(
          'Erreur', 
          'Impossible de rejoindre la partie.\n\nVérifiez que l\'ID de la partie est correct et que la partie existe encore.',
          [
            {
              text: 'OK',
              onPress: () => {
                setOnlineStatus('disconnected');
                setMatchIdInput(''); // Clear input for retry
              },
            },
          ]
        );
        setOnlineStatus('disconnected');
        break;

      case MESSAGE_TYPE.GAME_READY:
        setOnlineStatus('ready');
        setShowOnlineModal(false);
        setMatchIdToShare(''); // Clear match ID
        initializeBoard('online', player1Name, message.payload.otherPlayerName || 'Joueur 2');
        Alert.alert('Partie prête ! 🎮', 'L\'autre joueur a rejoint. La partie commence !');
        break;

      case MESSAGE_TYPE.MOVE_MAIN:
        // Opponent made a move
        dropPiece(message.payload.column, 2, true);
        break;

      case MESSAGE_TYPE.MOVE_SHADOW:
        // Our move confirmed
        break;

      case MESSAGE_TYPE.OTHER_PLAYER_HUNGUP:
        Alert.alert('Partie terminée', 'L\'autre joueur s\'est déconnecté.');
        setOnlineStatus('disconnected');
        break;
    }
  };

  // Online game initialization
  const initializeOnlineGame = (isHost: boolean, matchIdToJoin?: string) => {
    console.log('[ConnectFour] Initializing online game, isHost:', isHost);
    initWebSocketConnection(isHost, matchIdToJoin);
  };

  // Create new match (host)
  const createMatch = () => {
    console.log('[ConnectFour] Creating match...');
    setMatchIdToShare('');
    setMatchIdInput('');
    setShowOnlineModal(true);
    setOnlineStatus('connecting');
    // Small delay to ensure modal is visible before connecting
    setTimeout(() => {
      initializeOnlineGame(true);
    }, 100);
  };

  // Join existing match
  const joinMatch = (matchId: string) => {
    if (!matchId || matchId.trim() === '') {
      Alert.alert('Erreur', 'Veuillez entrer un ID de partie valide.');
      return;
    }
    console.log('[ConnectFour] Joining match:', matchId.trim());
    // Keep modal open to show connection status
    setOnlineStatus('connecting');
    setMatchIdToShare(''); // Clear any previous match ID
    initializeOnlineGame(false, matchId.trim());
  };

  // Copy match ID to clipboard
  const copyMatchId = async () => {
    if (matchIdToShare) {
      await Clipboard.setStringAsync(matchIdToShare);
      Alert.alert('Copié !', `ID de partie copié: ${matchIdToShare}\n\nPartagez-le avec votre ami pour qu'il puisse vous rejoindre.`);
    }
  };

  // Paste match ID from clipboard
  const pasteMatchId = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text && text.trim()) {
        setMatchIdInput(text.trim());
      } else {
        Alert.alert('Presse-papiers vide', 'Aucun texte trouvé dans le presse-papiers.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de lire le presse-papiers.');
    }
  };

  // Handle column press
  const handleColumnPress = (column: number) => {
    if (gameState.gameOver) return;
    
    // In AI mode, only allow player 1 to move
    if (gameMode === 'ai' && (gameState.isAITurn || gameState.currentPlayer !== 1)) {
      return;
    }
    
    // In offline mode, allow current player to move
    if (gameMode === 'offline') {
      dropPiece(column, gameState.currentPlayer, true);
    } 
    // In AI mode, only player 1 moves
    else if (gameMode === 'ai') {
      dropPiece(column, 1, true);
    }
    // In online mode, send move via WebSocket
    else if (gameMode === 'online') {
      // Only allow moves if it's our turn (player 1 is always the local player)
      if (gameState.currentPlayer === 1 && onlineStatus === 'ready') {
        dropPiece(column, 1, true);
        // Send move to server
        wsRef.current?.send(constructMessage(MESSAGE_TYPE.MOVE_MAIN, {
          column,
        }));
      }
    }
  };

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Reset game
  const handleReset = () => {
    if (gameMode) {
      initializeBoard(gameMode, player1Name, player2Name);
    } else {
      setGameMode(null);
    }
  };

  // Get piece color
  const getPieceColor = (player: Player): string => {
    return player === 1 ? '#ef453b' : '#0059ff'; // Red for player, Blue for AI
  };

  // Check if cell is part of winning line
  const isWinningCell = (row: number, col: number): boolean => {
    return gameState.winningCells.some(cell => cell.row === row && cell.col === col);
  };

  // Render piece
  const renderPiece = (row: number, col: number, player: CellValue) => {
    if (player === 0) return null;

    const key = `${row}-${col}`;
    const animatedStyle = dropAnimations[key]
      ? {
          transform: dropAnimations[key].getTranslateTransform(),
        }
      : {};

    const isWinner = isWinningCell(row, col);
    const scaleAnim = pieceAnimations[key] || new Animated.Value(1);
    if (!pieceAnimations[key]) {
      pieceAnimations[key] = scaleAnim;
    }

    // Pulse animation for winning pieces
    if (isWinner) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    return (
      <Animated.View
        key={key}
        style={[
          styles.piece,
          {
            backgroundColor: getPieceColor(player),
            width: PIECE_SIZE,
            height: PIECE_SIZE,
            borderRadius: PIECE_SIZE / 2,
            borderWidth: isWinner ? 4 : 3,
            borderColor: isWinner ? '#FFD700' : 'rgba(0, 0, 0, 0.3)',
            transform: [
              ...(animatedStyle.transform || []),
              { scale: scaleAnim },
            ],
          },
        ]}
      />
    );
  };

  // Show mode selection if no mode selected
  if (!gameMode) {
    return (
      <RNSafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {game.title}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.modeSelectionContainer}>
          <Text style={[styles.modeTitle, { color: colors.textPrimary }]}>
            Choisis un mode de jeu
          </Text>

          {/* AI Mode */}
          <TouchableOpacity
            style={[styles.modeButton, { backgroundColor: colors.cardBackground }]}
            onPress={() => startGame('ai')}
          >
            <View style={styles.modeButtonContent}>
              <Ionicons name="hardware-chip" size={32} color={colors.primary} />
              <View style={styles.modeButtonText}>
                <Text style={[styles.modeButtonTitle, { color: colors.textPrimary }]}>
                  Contre l'IA
                </Text>
                <Text style={[styles.modeButtonDescription, { color: colors.textSecondary }]}>
                  Joue contre une intelligence artificielle
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Offline 2-Player Mode */}
          <TouchableOpacity
            style={[styles.modeButton, { backgroundColor: colors.cardBackground }]}
            onPress={() => startGame('offline')}
          >
            <View style={styles.modeButtonContent}>
              <Ionicons name="people" size={32} color={colors.primary} />
              <View style={styles.modeButtonText}>
                <Text style={[styles.modeButtonTitle, { color: colors.textPrimary }]}>
                  2 Joueurs (Local)
                </Text>
                <Text style={[styles.modeButtonDescription, { color: colors.textSecondary }]}>
                  Passe le téléphone entre les joueurs
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Online Mode - Create Match */}
          <TouchableOpacity
            style={[styles.modeButton, { backgroundColor: colors.cardBackground }]}
            onPress={createMatch}
          >
            <View style={styles.modeButtonContent}>
              <Ionicons name="globe" size={32} color={colors.primary} />
              <View style={styles.modeButtonText}>
                <Text style={[styles.modeButtonTitle, { color: colors.textPrimary }]}>
                  Créer une partie en ligne
                </Text>
                <Text style={[styles.modeButtonDescription, { color: colors.textSecondary }]}>
                  Crée une partie et partage l'ID avec un ami
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Online Mode - Join Match */}
          <TouchableOpacity
            style={[styles.modeButton, { backgroundColor: colors.cardBackground }]}
            onPress={() => {
              console.log('[ConnectFour] Join match button pressed');
              setMatchIdInput('');
              setMatchIdToShare('');
              setOnlineStatus('disconnected');
              setShowOnlineModal(true);
              console.log('[ConnectFour] Modal state set - showOnlineModal: true, matchIdToShare:', '', 'onlineStatus: disconnected');
            }}
          >
            <View style={styles.modeButtonContent}>
              <Ionicons name="enter" size={32} color={colors.primary} />
              <View style={styles.modeButtonText}>
                <Text style={[styles.modeButtonTitle, { color: colors.textPrimary }]}>
                  Rejoindre une partie
                </Text>
                <Text style={[styles.modeButtonDescription, { color: colors.textSecondary }]}>
                  Entre l'ID de partie reçu d'un ami
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Online Match Modal - Also available in mode selection */}
        {showOnlineModal && (
          <Modal
            visible={showOnlineModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              // Allow closing even when waiting
              if (onlineStatus === 'waiting') {
                Alert.alert(
                  'Fermer le modal ?',
                  'La partie reste active. Vous pouvez la retrouver en cliquant sur "Rejoindre une partie" et en entrant l\'ID.',
                  [
                    { text: 'Annuler', style: 'cancel' },
                    { 
                      text: 'Fermer', 
                      onPress: () => setShowOnlineModal(false),
                      style: 'destructive',
                    },
                  ]
                );
              } else {
                setShowOnlineModal(false);
              }
            }}
            statusBarTranslucent={true}
            presentationStyle="overFullScreen"
          >
            <RNSafeAreaView style={styles.modalOverlay} edges={['top', 'bottom']}>
              <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                    {matchIdToShare ? 'Partie créée !' : 'Rejoindre une partie'}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    // Allow closing even when waiting, but keep WebSocket connection
                    if (onlineStatus === 'waiting') {
                      Alert.alert(
                        'Fermer le modal ?',
                        'La partie reste active. Vous pouvez la retrouver en cliquant sur "Rejoindre une partie" et en entrant l\'ID.',
                        [
                          { text: 'Annuler', style: 'cancel' },
                          { 
                            text: 'Fermer', 
                            onPress: () => setShowOnlineModal(false),
                            style: 'destructive',
                          },
                        ]
                      );
                    } else {
                      setShowOnlineModal(false);
                    }
                  }}>
                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  {(() => {
                    console.log('[ConnectFour] Modal render - matchIdToShare:', matchIdToShare, 'onlineStatus:', onlineStatus);
                    if (matchIdToShare) {
                      // Show match ID to share (when creating a match)
                      return (
                        <View>
                          <Text style={[styles.modalText, { color: colors.textSecondary }]}>
                            Partagez cet ID avec votre ami :
                          </Text>
                          <View style={[styles.matchIdContainer, { backgroundColor: colors.background }]}>
                            <Text style={[styles.matchIdText, { color: colors.textPrimary }]}>
                              {matchIdToShare}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={[styles.copyButton, { backgroundColor: colors.primary }]}
                            onPress={copyMatchId}
                          >
                            <Ionicons name="copy-outline" size={20} color={colors.background} />
                            <Text style={[styles.copyButtonText, { color: colors.background }]}>
                              Copier l'ID
                            </Text>
                          </TouchableOpacity>
                          <Text style={[styles.modalStatus, { color: colors.textSecondary }]}>
                            {onlineStatus === 'waiting' ? 'En attente d\'un joueur...' : 'Connexion...'}
                          </Text>
                        </View>
                      );
                    } else if (onlineStatus === 'connecting') {
                      // Show loading while connecting
                      return (
                        <View style={styles.loadingView}>
                          <ActivityIndicator size="large" color={colors.primary} />
                          <Text style={[styles.modalStatus, { color: colors.textSecondary, marginTop: SPACING.md }]}>
                            {matchIdInput ? 'Connexion à la partie...' : 'Connexion au serveur...'}
                          </Text>
                        </View>
                      );
                    } else {
                      // Join match form (default when no matchIdToShare and not connecting)
                      console.log('[ConnectFour] Rendering join form');
                      return (
                        <View style={{ minHeight: 200, padding: SPACING.md }}>
                          <Text style={[styles.modalText, { color: colors.textSecondary }]}>
                            Entrez l'ID de la partie :
                          </Text>
                          <View style={styles.inputContainer}>
                            <TextInput
                              style={[styles.matchIdInput, { 
                                backgroundColor: colors.background, 
                                color: colors.textPrimary,
                                borderColor: colors.textSecondary + '40',
                                flex: 1,
                              }]}
                              value={matchIdInput}
                              onChangeText={setMatchIdInput}
                              placeholder="ID de la partie"
                              placeholderTextColor={colors.textSecondary}
                              autoCapitalize="none"
                              autoCorrect={false}
                              editable={onlineStatus !== 'connecting'}
                            />
                            <TouchableOpacity
                              style={[styles.pasteButton, { 
                                backgroundColor: colors.primary + '20',
                                borderColor: colors.primary,
                              }]}
                              onPress={pasteMatchId}
                              disabled={onlineStatus === 'connecting'}
                            >
                              <Ionicons name="clipboard-outline" size={20} color={colors.primary} />
                              <Text style={[styles.pasteButtonText, { color: colors.primary }]}>
                                Coller
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            style={[
                              styles.joinButton, 
                              { 
                                backgroundColor: colors.primary,
                                opacity: onlineStatus === 'connecting' ? 0.5 : 1,
                              }
                            ]}
                            onPress={() => {
                              console.log('[ConnectFour] Join button pressed, matchIdInput:', matchIdInput);
                              if (onlineStatus !== 'connecting' && matchIdInput.trim()) {
                                joinMatch(matchIdInput);
                              } else if (!matchIdInput.trim()) {
                                Alert.alert('Erreur', 'Veuillez entrer un ID de partie.');
                              }
                            }}
                            disabled={onlineStatus === 'connecting' || !matchIdInput.trim()}
                          >
                            <Text style={[styles.joinButtonText, { color: colors.background }]}>
                              {onlineStatus === 'connecting' ? 'Connexion...' : 'Rejoindre'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }
                  })()}
                </ScrollView>
              </View>
            </RNSafeAreaView>
          </Modal>
        )}
      </RNSafeAreaView>
    );
  }

  return (
    <RNSafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setGameMode(null)}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {game.title}
        </Text>
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Game Info */}
      <View style={styles.gameInfo}>
        {gameState.gameOver ? (
          <View style={styles.winnerContainer}>
            <Text style={[styles.statusText, { color: colors.textPrimary }]}>
              {gameState.winner
                ? `🎉 ${gameMode === 'ai' 
                  ? (gameState.winner === 1 ? 'Tu as gagné !' : "L'IA a gagné !")
                  : (gameState.winner === 1 ? `${gameState.player1Name} a gagné !` : `${gameState.player2Name} a gagné !`)
                }`
                : "Match nul ! 🤝"}
            </Text>
          </View>
        ) : (
          <View style={styles.turnIndicator}>
            <View style={[styles.playerBadge, { backgroundColor: gameState.currentPlayer === 1 ? '#ef453b20' : '#0059ff20' }]}>
              <View style={[styles.playerDot, { backgroundColor: gameState.currentPlayer === 1 ? '#ef453b' : '#0059ff' }]} />
              <Text style={[styles.statusText, { color: colors.textPrimary }]}>
                {gameMode === 'ai' && gameState.isAITurn
                  ? "Tour de l'IA..."
                  : gameMode === 'offline'
                  ? `Tour de ${gameState.currentPlayer === 1 ? gameState.player1Name : gameState.player2Name}`
                  : `Tour de ${gameState.currentPlayer === 1 ? gameState.player1Name : gameState.player2Name}`
                }
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Game Board */}
      <View style={styles.boardContainer}>
        <View style={[styles.board, { backgroundColor: '#1a5490' }]}>
          {/* Board cells */}
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  {
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: '#0d3a66',
                    marginRight: colIndex < COLUMNS - 1 ? SPACING.sm : 0,
                    marginBottom: rowIndex < ROWS - 1 ? SPACING.sm : 0,
                    borderRadius: CELL_SIZE / 2,
                  },
                ]}
              >
                {renderPiece(rowIndex, colIndex, cell)}
              </View>
            ))
          )}
        </View>

        {/* Column buttons (invisible overlay) */}
        <View style={styles.columnOverlay}>
          {Array.from({ length: COLUMNS }).map((_, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={[
                styles.columnButton,
                {
                  width: CELL_SIZE + (colIndex < COLUMNS - 1 ? SPACING.sm : 0),
                },
              ]}
              onPress={() => handleColumnPress(colIndex)}
              disabled={
                gameState.gameOver || 
                (gameMode === 'ai' && (gameState.isAITurn || gameState.currentPlayer !== 1))
              }
              activeOpacity={0.7}
            />
          ))}
        </View>
      </View>

      {/* Player Info */}
      <View style={styles.playerInfo}>
        <View style={styles.playerIndicator}>
          <View style={[styles.playerPiece, { backgroundColor: '#ef453b' }]} />
          <Text style={[styles.playerLabel, { color: colors.textSecondary }]}>
            {gameState.player1Name}
          </Text>
        </View>
        <View style={styles.playerIndicator}>
          <View style={[styles.playerPiece, { backgroundColor: '#0059ff' }]} />
          <Text style={[styles.playerLabel, { color: colors.textSecondary }]}>
            {gameState.player2Name}
          </Text>
        </View>
      </View>

      {/* Online Match Modal */}
      {showOnlineModal && (
        <Modal
          visible={showOnlineModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            // Allow closing even when waiting
            if (onlineStatus === 'waiting') {
              Alert.alert(
                'Fermer le modal ?',
                'La partie reste active. Vous pouvez la retrouver en cliquant sur "Rejoindre une partie" et en entrant l\'ID.',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { 
                    text: 'Fermer', 
                    onPress: () => setShowOnlineModal(false),
                    style: 'destructive',
                  },
                ]
              );
            } else {
              setShowOnlineModal(false);
            }
          }}
          statusBarTranslucent={true}
          presentationStyle="overFullScreen"
        >
          <RNSafeAreaView style={styles.modalOverlay} edges={['top', 'bottom']}>
            <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {matchIdToShare ? 'Partie créée !' : 'Rejoindre une partie'}
              </Text>
              <TouchableOpacity onPress={() => {
                // Allow closing even when waiting, but keep WebSocket connection
                if (onlineStatus === 'waiting') {
                  Alert.alert(
                    'Fermer le modal ?',
                    'La partie reste active. Vous pouvez la retrouver en cliquant sur "Rejoindre une partie" et en entrant l\'ID.',
                    [
                      { text: 'Annuler', style: 'cancel' },
                      { 
                        text: 'Fermer', 
                        onPress: () => setShowOnlineModal(false),
                        style: 'destructive',
                      },
                    ]
                  );
                } else {
                  setShowOnlineModal(false);
                }
              }}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {(() => {
                console.log('[ConnectFour] Modal render (game) - matchIdToShare:', matchIdToShare, 'onlineStatus:', onlineStatus);
                if (matchIdToShare) {
                  // Show match ID to share (when creating a match)
                  return (
                    <View>
                      <Text style={[styles.modalText, { color: colors.textSecondary }]}>
                        Partagez cet ID avec votre ami :
                      </Text>
                      <View style={[styles.matchIdContainer, { backgroundColor: colors.background }]}>
                        <Text style={[styles.matchIdText, { color: colors.textPrimary }]}>
                          {matchIdToShare}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.copyButton, { backgroundColor: colors.primary }]}
                        onPress={copyMatchId}
                      >
                        <Ionicons name="copy-outline" size={20} color={colors.background} />
                        <Text style={[styles.copyButtonText, { color: colors.background }]}>
                          Copier l'ID
                        </Text>
                      </TouchableOpacity>
                      <Text style={[styles.modalStatus, { color: colors.textSecondary }]}>
                        {onlineStatus === 'waiting' ? 'En attente d\'un joueur...' : 'Connexion...'}
                      </Text>
                    </View>
                  );
                } else if (onlineStatus === 'connecting') {
                  // Show loading while connecting
                  return (
                    <View style={styles.loadingView}>
                      <ActivityIndicator size="large" color={colors.primary} />
                      <Text style={[styles.modalStatus, { color: colors.textSecondary, marginTop: SPACING.md }]}>
                        {matchIdInput ? 'Connexion à la partie...' : 'Connexion au serveur...'}
                      </Text>
                    </View>
                  );
                } else {
                  // Join match form (default when no matchIdToShare and not connecting)
                  console.log('[ConnectFour] Rendering join form (game)');
                  return (
                    <View style={{ minHeight: 200, padding: SPACING.md }}>
                      <Text style={[styles.modalText, { color: colors.textSecondary }]}>
                        Entrez l'ID de la partie :
                      </Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.matchIdInput, { 
                        backgroundColor: colors.background, 
                        color: colors.textPrimary,
                        borderColor: colors.textSecondary + '40',
                        flex: 1,
                      }]}
                      value={matchIdInput}
                      onChangeText={setMatchIdInput}
                      placeholder="ID de la partie"
                      placeholderTextColor={colors.textSecondary}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={onlineStatus !== 'connecting'}
                    />
                    <TouchableOpacity
                      style={[styles.pasteButton, { 
                        backgroundColor: colors.primary + '20',
                        borderColor: colors.primary,
                      }]}
                      onPress={pasteMatchId}
                      disabled={onlineStatus === 'connecting'}
                    >
                      <Ionicons name="clipboard-outline" size={20} color={colors.primary} />
                      <Text style={[styles.pasteButtonText, { color: colors.primary }]}>
                        Coller
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.joinButton, 
                      { 
                        backgroundColor: colors.primary,
                        opacity: onlineStatus === 'connecting' ? 0.5 : 1,
                      }
                    ]}
                    onPress={() => {
                      console.log('[ConnectFour] Join button pressed (game), matchIdInput:', matchIdInput);
                      if (onlineStatus !== 'connecting' && matchIdInput.trim()) {
                        joinMatch(matchIdInput);
                      } else if (!matchIdInput.trim()) {
                        Alert.alert('Erreur', 'Veuillez entrer un ID de partie.');
                      }
                    }}
                    disabled={onlineStatus === 'connecting' || !matchIdInput.trim()}
                  >
                    <Text style={[styles.joinButtonText, { color: colors.background }]}>
                      {onlineStatus === 'connecting' ? 'Connexion...' : 'Rejoindre'}
                    </Text>
                  </TouchableOpacity>
                    </View>
                  );
                }
              })()}
            </ScrollView>
            </View>
          </RNSafeAreaView>
        </Modal>
      )}
    </RNSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    flex: 1,
    textAlign: 'center',
  },
  resetButton: {
    padding: SPACING.xs,
  },
  gameInfo: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  turnIndicator: {
    width: '100%',
    alignItems: 'center',
  },
  playerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.sm,
  },
  playerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  winnerContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: BOARD_PADDING,
    paddingTop: SPACING.md,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  columnOverlay: {
    position: 'absolute',
    top: BOARD_PADDING + SPACING.md,
    left: BOARD_PADDING + SPACING.md,
    right: BOARD_PADDING + SPACING.md,
    bottom: BOARD_PADDING + SPACING.md,
    flexDirection: 'row',
  },
  columnButton: {
    height: '100%',
  },
  playerInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  playerIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  playerPiece: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  playerLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
  },
  modeSelectionContainer: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  modeTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
  modeButtonText: {
    flex: 1,
  },
  modeButtonTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
  modeButtonDescription: {
    fontSize: FONTS.sizes.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    maxHeight: '80%',
    zIndex: 10000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
  },
  modalBody: {
    minHeight: 200,
  },
  modalText: {
    fontSize: FONTS.sizes.md,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  matchIdContainer: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  matchIdText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  matchIdInput: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONTS.sizes.md,
    borderWidth: 1,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  pasteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    gap: SPACING.xs,
    minWidth: 80,
  },
  pasteButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  copyButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  joinButton: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  joinButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  modalStatus: {
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
    marginTop: SPACING.md,
    fontStyle: 'italic',
  },
  loadingView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
});

export default ConnectFourGame;
