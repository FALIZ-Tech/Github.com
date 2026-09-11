import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../theme/colors';

interface CodeViewerProps {
  initialCode: string;
  filename: string;
  editable?: boolean;
  onSave?: (newContent: string) => void;
  branch?: string;
  onBranchPress?: () => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  initialCode,
  filename,
  editable = true,
  onSave,
  branch = 'main',
  onBranchPress,
}) => {
  const [code, setCode] = useState(initialCode);
  const [history, setHistory] = useState<string[]>([initialCode]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [copied, setCopied] = useState(false);

  const lines = code.split('\n');

  const handleTextChange = (text: string) => {
    setCode(text);
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(text);
    if (newHist.length > 30) newHist.shift();
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCode(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCode(next);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectAll = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Code Editor Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <Ionicons name="code-slash" size={16} color={Colors.neonCyan} />
          <Text style={styles.filenameText} numberOfLines={1}>
            {filename}
          </Text>
          {branch && (
            <TouchableOpacity style={styles.branchPill} onPress={onBranchPress}>
              <Ionicons name="git-branch-outline" size={11} color={Colors.neonBlue} />
              <Text style={styles.branchText}>{branch}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.toolbarRight}>
          <TouchableOpacity
            style={styles.toolIconBtn}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Ionicons name="search" size={15} color={showSearch ? Colors.neonCyan : Colors.textSecondary} />
          </TouchableOpacity>

          {editable && (
            <>
              <TouchableOpacity
                style={[styles.toolIconBtn, historyIndex === 0 && styles.toolDisabled]}
                onPress={handleUndo}
                disabled={historyIndex === 0}
              >
                <Ionicons name="arrow-undo-outline" size={15} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toolIconBtn, historyIndex === history.length - 1 && styles.toolDisabled]}
                onPress={handleRedo}
                disabled={historyIndex === history.length - 1}
              >
                <Ionicons name="arrow-redo-outline" size={15} color={Colors.textSecondary} />
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.toolIconBtn} onPress={handleCopy}>
            <Ionicons
              name={copied ? 'checkmark' : 'copy-outline'}
              size={15}
              color={copied ? Colors.neonGreen : Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar if enabled */}
      {showSearch && (
        <View style={styles.searchBar}>
          <Ionicons name="search" size={14} color={Colors.neonCyan} style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Find in file..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={15} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Editor Body with Line Numbers */}
      <View style={styles.editorBody}>
        {/* Line Numbers Column */}
        <ScrollView style={styles.lineNumberCol} showsVerticalScrollIndicator={false}>
          {lines.map((_, i) => (
            <Text key={i} style={styles.lineNumberText}>
              {i + 1}
            </Text>
          ))}
        </ScrollView>

        {/* Code Content Area */}
        <ScrollView
          style={styles.codeScroll}
          horizontal
          showsHorizontalScrollIndicator={true}
        >
          <ScrollView style={styles.codeInnerScroll} showsVerticalScrollIndicator={true}>
            {editable ? (
              <TextInput
                style={styles.codeInput}
                multiline
                value={code}
                onChangeText={handleTextChange}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                textAlignVertical="top"
              />
            ) : (
              <Text style={styles.codeDisplayText}>{code}</Text>
            )}
          </ScrollView>
        </ScrollView>
      </View>

      {/* Footer / Save Action */}
      {editable && onSave && (
        <View style={styles.footer}>
          <Text style={styles.footerInfo}>
            {lines.length} lines • {code.length} chars
          </Text>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => onSave(code)}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-done" size={16} color="#070B14" />
            <Text style={styles.saveBtnText}>Review & Commit</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCode,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  filenameText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    maxWidth: 160,
  },
  branchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  branchText: {
    fontSize: 10,
    color: Colors.neonBlue,
    fontWeight: '600',
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolDisabled: {
    opacity: 0.3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 12,
    padding: 0,
  },
  editorBody: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.bgCode,
  },
  lineNumberCol: {
    width: 38,
    backgroundColor: 'rgba(10, 15, 29, 0.85)',
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.05)',
  },
  lineNumberText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  codeScroll: {
    flex: 1,
  },
  codeInnerScroll: {
    flex: 1,
    padding: 10,
    minWidth: 400,
  },
  codeInput: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#38BDF8',
    lineHeight: 20,
    padding: 0,
    margin: 0,
  },
  codeDisplayText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#38BDF8',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  footerInfo: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.neonCyan,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#070B14',
    fontSize: 12,
    fontWeight: '700',
  },
});
