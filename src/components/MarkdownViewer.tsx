import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../theme/colors';

interface MarkdownViewerProps {
  content: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopyCode = async (code: string, idx: number) => {
    await Clipboard.setStringAsync(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderLines = () => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockLang = '';
    let codeBlockLines: string[] = [];
    let blockIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block start / end
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockLang = line.trim().replace('```', '') || 'code';
          codeBlockLines = [];
        } else {
          inCodeBlock = false;
          const currentCode = codeBlockLines.join('\n');
          const currentIdx = blockIndex++;
          const isCopied = copiedIndex === currentIdx;

          elements.push(
            <View key={`code-${i}`} style={styles.codeContainer}>
              <View style={styles.codeHeader}>
                <View style={styles.codeLangRow}>
                  <Ionicons name="terminal-outline" size={13} color={Colors.neonCyan} />
                  <Text style={styles.codeLangText}>{codeBlockLang}</Text>
                </View>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => handleCopyCode(currentCode, currentIdx)}
                >
                  <Ionicons
                    name={isCopied ? 'checkmark' : 'copy-outline'}
                    size={13}
                    color={isCopied ? Colors.neonGreen : Colors.textSecondary}
                  />
                  <Text style={[styles.copyBtnText, isCopied && { color: Colors.neonGreen }]}>
                    {isCopied ? 'Copied' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text style={styles.codeText}>{currentCode}</Text>
              </ScrollView>
            </View>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockLines.push(line);
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <Text key={i} style={styles.h1}>
            {line.replace('# ', '')}
          </Text>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <Text key={i} style={styles.h2}>
            {line.replace('## ', '')}
          </Text>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <Text key={i} style={styles.h3}>
            {line.replace('### ', '')}
          </Text>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <View key={i} style={styles.blockquote}>
            <Text style={styles.blockquoteText}>{line.replace('> ', '')}</Text>
          </View>
        );
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().substring(2);
        elements.push(
          <View key={i} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{bulletText}</Text>
          </View>
        );
      } else if (line.trim().length > 0) {
        elements.push(
          <Text key={i} style={styles.paragraph}>
            {line}
          </Text>
        );
      } else {
        elements.push(<View key={i} style={styles.emptyLine} />);
      }
    }

    return elements;
  };

  return <View style={styles.wrapper}>{renderLines()}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  h1: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 18,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
    paddingBottom: 6,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neonCyan,
    marginTop: 14,
    marginBottom: 6,
  },
  h3: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.neonBlue,
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 21,
    marginVertical: 3,
  },
  emptyLine: {
    height: 8,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.neonCyan,
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  blockquoteText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.neonCyan,
    marginTop: 8,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  codeContainer: {
    backgroundColor: Colors.bgCode,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    marginVertical: 10,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  codeLangRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  codeLangText: {
    fontSize: 11,
    color: Colors.neonCyan,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  copyBtnText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#38BDF8',
    padding: 12,
    lineHeight: 18,
  },
});
