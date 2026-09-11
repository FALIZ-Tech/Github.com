import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../theme/colors';

interface DiffViewerModalProps {
  visible: boolean;
  filename: string;
  originalContent: string;
  newContent: string;
  branch: string;
  onClose: () => void;
  onCommit: (commitMessage: string) => Promise<void>;
}

export const DiffViewerModal: React.FC<DiffViewerModalProps> = ({
  visible,
  filename,
  originalContent,
  newContent,
  branch,
  onClose,
  onCommit,
}) => {
  const [commitMessage, setCommitMessage] = useState(
    `Update ${filename.split('/').pop() || filename}`
  );
  const [committing, setCommitting] = useState(false);
  const [commitSuccess, setCommitSuccess] = useState(false);

  // Compute a simple line-by-line diff
  const oldLines = originalContent.split('\n');
  const newLines = newContent.split('\n');

  let additions = 0;
  let deletions = 0;

  const diffLines: Array<{ type: 'same' | 'added' | 'removed'; text: string; lineNo?: number }> = [];

  const maxLines = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < maxLines; i++) {
    const o = oldLines[i];
    const n = newLines[i];

    if (o === n) {
      if (diffLines.length < 80) {
        diffLines.push({ type: 'same', text: o ?? '', lineNo: i + 1 });
      }
    } else {
      if (o !== undefined) {
        deletions++;
        diffLines.push({ type: 'removed', text: o, lineNo: i + 1 });
      }
      if (n !== undefined) {
        additions++;
        diffLines.push({ type: 'added', text: n, lineNo: i + 1 });
      }
    }
  }

  const handleConfirmCommit = async () => {
    if (!commitMessage.trim()) return;
    setCommitting(true);
    try {
      await onCommit(commitMessage);
      setCommitSuccess(true);
      setTimeout(() => {
        setCommitSuccess(false);
        onClose();
      }, 1500);
    } catch {
      // error handled in caller
    } finally {
      setCommitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="git-commit-outline" size={18} color={Colors.neonCyan} />
              <Text style={styles.title}>Review Changes</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Meta bar */}
          <View style={styles.metaBar}>
            <Text style={styles.metaFilename} numberOfLines={1}>
              {filename}
            </Text>
            <View style={styles.diffCounts}>
              <Text style={styles.countAdd}>+{additions}</Text>
              <Text style={styles.countDel}>-{deletions}</Text>
              <View style={styles.branchPill}>
                <Ionicons name="git-branch" size={10} color={Colors.neonBlue} />
                <Text style={styles.branchText}>{branch}</Text>
              </View>
            </View>
          </View>

          {/* Diff View */}
          <ScrollView style={styles.diffScroll} showsVerticalScrollIndicator>
            {diffLines.length === 0 || (additions === 0 && deletions === 0) ? (
              <View style={styles.noChangesBox}>
                <Ionicons name="checkmark-circle-outline" size={32} color={Colors.neonGreen} />
                <Text style={styles.noChangesText}>No modifications detected</Text>
              </View>
            ) : (
              diffLines.map((line, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.diffLine,
                    line.type === 'added' && styles.lineAdded,
                    line.type === 'removed' && styles.lineRemoved,
                  ]}
                >
                  <Text style={styles.diffSign}>
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </Text>
                  <Text
                    style={[
                      styles.diffLineText,
                      line.type === 'added' && styles.textAdded,
                      line.type === 'removed' && styles.textRemoved,
                    ]}
                  >
                    {line.text}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>

          {/* Commit Message Box */}
          <View style={styles.commitBox}>
            <Text style={styles.inputLabel}>Commit Message</Text>
            <TextInput
              style={styles.input}
              placeholder="Describe your changes..."
              placeholderTextColor={Colors.textMuted}
              value={commitMessage}
              onChangeText={setCommitMessage}
            />

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={committing}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  (!commitMessage.trim() || committing) && styles.btnDisabled,
                ]}
                onPress={handleConfirmCommit}
                disabled={!commitMessage.trim() || committing}
              >
                {committing ? (
                  <ActivityIndicator size="small" color="#070B14" />
                ) : commitSuccess ? (
                  <View style={styles.successRow}>
                    <Ionicons name="checkmark-circle" size={16} color="#070B14" />
                    <Text style={styles.confirmBtnText}>Pushed!</Text>
                  </View>
                ) : (
                  <View style={styles.successRow}>
                    <Ionicons name="cloud-upload-outline" size={16} color="#070B14" />
                    <Text style={styles.confirmBtnText}>Confirm & Push</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
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
    padding: 16,
  },
  card: {
    backgroundColor: '#0D1424',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    maxHeight: '88%',
    overflow: 'hidden',
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  metaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  metaFilename: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.neonCyan,
    flex: 1,
    marginRight: 8,
  },
  diffCounts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countAdd: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.neonGreen,
  },
  countDel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.neonRose,
  },
  branchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  branchText: {
    fontSize: 10,
    color: Colors.neonBlue,
    fontWeight: '600',
  },
  diffScroll: {
    padding: 12,
    maxHeight: 240,
    backgroundColor: Colors.bgCode,
  },
  noChangesBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
  },
  noChangesText: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
  },
  diffLine: {
    flexDirection: 'row',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  lineAdded: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  lineRemoved: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
  },
  diffSign: {
    fontFamily: 'monospace',
    fontSize: 12,
    width: 14,
    color: Colors.textMuted,
  },
  diffLineText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#CBD5E1',
    flex: 1,
  },
  textAdded: {
    color: '#34D399',
  },
  textRemoved: {
    color: '#FB7185',
  },
  commitBox: {
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: Colors.textPrimary,
    fontSize: 13,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: Colors.neonCyan,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    shadowColor: Colors.neonCyan,
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  confirmBtnText: {
    color: '#070B14',
    fontSize: 13,
    fontWeight: '800',
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
