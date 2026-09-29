/* eslint-disable react-hooks/set-state-in-effect */
import Markdown from 'markdown-to-jsx';
import changelogFile from '/CHANGELOG.md?raw';
import { Page } from '@/src/components/surfaces/Page';
import { useTranslation } from 'react-i18next';
import { Box, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { getAllVersionsFromChangelog, getVersionsFromChangelog } from '@/src/utils/changelog';
import type { SelectChangeEvent } from '@/src/types/events';
import { useParams } from 'react-router';

export const ChangeLogPage = () => {
  const { t } = useTranslation('pages');
  const { version } = useParams();
  const [content, setContent] = useState<string>(changelogFile);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(version || 'all');
  const versions = getAllVersionsFromChangelog(changelogFile);

  const handleChange = (e: SelectChangeEvent<string>) => {
    const version = e.target.value;
    if (!version) return;

    if (version === 'all') {
      setSelectedVersion('all');
      return setContent(changelogFile);
    }

    setSelectedVersion(version);
    return setContent(
      getVersionsFromChangelog(changelogFile, version)
    );
  };

  useEffect(() => {
    if (!version) return;
    
    setContent(
      getVersionsFromChangelog(changelogFile, version)
    );
  }, [version]);

  return (
    <>
      <Page title={t('changelog.title')}>
        <Box>
          <InputLabel id="select-version">
            Version
          </InputLabel>
          <Select
            labelId="select-version"
            label="Version"
            value={selectedVersion}
            onChange={handleChange}
          >
            <MenuItem value="all">All</MenuItem>
            {versions.map((version) => (
              <MenuItem key={version} value={version}>
                {version}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Markdown>{content}</Markdown>
      </Page>
    </>
  );
};