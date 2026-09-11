import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CodeViewer } from '../components/CodeViewer';
import { DiffViewerModal } from '../components/DiffViewer';
import { Colors } from '../theme/colors';
import { githubApi } from '../api/githubApi';
import { GitHubRepo } from '../models/github';

interface CodeEditorScreenProps {
  initialFilename: string;
  initialCode: string;
  initialBranch: string;
  repo: GitHubRepo;
  onBack: () => void;
  onCommitSuccess: () => void;
}

export const CodeEditorScreen: React.FC<CodeEditorScreenProps> = ({
  initialFilename,
  initialCode,
  initialBranch,
  repo,
  onBack,
  onCommitSuccess,
}) => {
  const [filename, setFilename] = useState(initialFilename);
  const [currentCode, setCurrentCode] = useState(initialCode);
  const [branch, setBranch] = useState(initialBranch);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [isEditingPath, setIsEditingPath] = useState(false);

  const owner = repo.owner?.login || 'gamesiteonline';

  const handleReviewChanges = (code: string) => {
    setCurrentCode(code);
    setShowDiffModal(true);
  };

  const handleCommit = async (commitMessage: string) => {
    try {
      await githubApi.commitFileChange(
        owner,
        repo.name,
        filename,
        currentCode,
        commitMessage,
        undefined,
        branch
      );
      onCommitSuccess();
    } catch (err: any) {
      Alert.alert('Commit Notice', err.message || 'Commit recorded to session.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={Colors.neonCyan} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          {isEditingPath ? (
            <TextInput
              style={styles.pathInput}
              value={filename}
              onChangeText={setFilename}
              onBlur={() => setIsEditingPath(false)}
              autoFocus
              autoCapitalize="none"
            />
          ) : (
            <TouchableOpacity
              style={styles.pathTouchRow}
              onPress={() => setIsEditingPath(true)}
            >
              <Text style={styles.pathText} numberOfLines={1}>
                {filename}
              </Text>
              <Ionicons name="pencil" size={11} color={Colors.neonBlue} />
            </TouchableOpacity>
          )}
          <Text style={styles.repoSubText}>
            {repo.name} • branch: {branch}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.reviewBtn}
          onPress={() => handleReviewChanges(currentCode)}
        >
          <Ionicons name="git-commit-outline" size={15} color="#070B14" />
          <Text style={styles.reviewBtnText}>Commit</Text>
        </TouchableOpacity>
      </View>

      {/* Editor Main */}
      <View style={styles.editorContainer}>
        <CodeViewer
          initialCode={initialCode}
          filename={filename}
          branch={branch}
          editable={true}
          onSave={handleReviewChanges}
        />
      </View>

      {/* Review Changes & Commit Modal */}
      <DiffViewerModal
        visible={showDiffModal}
        filename={filename}
        originalContent={initialCode}
        newContent={currentCode}
        branch={branch}
        onClose={() => setShowDiffModal(false)}
        onCommit={handleCommit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(7, 11, 20, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitleWrap: {
    flex: 1,
  },
  pathTouchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pathText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  pathInput: {
    color: Colors.neonCyan,
    fontSize: 14,
    fontWeight: '700',
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neonCyan,
  },
  repoSubText: {
    fontSize: 10,
    color: Colors.neonBlue,
    marginTop: 2,
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neonCyan,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  reviewBtnText: {
    color: '#070B14',
    fontSize: 12,
    fontWeight: '800',
  },
  editorContainer: {
    flex: 1,
    padding: 10,
  },
});
