import { access } from 'node:fs/promises';
import stripAnsi from 'strip-ansi';

import { ErrorMessage } from 'pkgverse/plugin-lint/src/errors';

export type ReporterFactory = (
  currentFile: string
) => (type: ReportType, message: string) => void;

export type ReportType = 'warn' | 'error';

export * from './mdast';
export * from './babel';
export * from './link-protection';

/**
 * Filters out empty and debug lines from linter output.
 *
 * Until something is done about https://github.com/nodejs/node/issues/34799, we
 * unfortunately have to remove the annoying debugging lines manually...
 */
export function ignoreEmptyAndDebugLines(line: string) {
  return (
    stripAnsi(line) &&
    line != 'Debugger attached.' &&
    line != 'Waiting for the debugger to disconnect...'
  );
}

/**
 * Accepts the `summaryLine` of linter output and the result of `RegExp.exec`
 * (`metaSummaryLine`), where the `errors` and `warning` capture groups have
 * been defined, and returns a normalized summary of the number of errors and
 * warnings that occurred.
 */
export function summarizeLinterOutput(
  exitCode: number,
  summaryLine: string,
  summaryLineMeta: ReturnType<RegExp['exec']>
) {
  const errors = Number.parseInt(summaryLineMeta?.groups?.errors || '0');
  const warnings = Number.parseInt(summaryLineMeta?.groups?.warnings || '0');

  return !summaryLine
    ? exitCode == 0
      ? 'no issues'
      : 'unknown issue'
    : errors + warnings
      ? `${errors} error${errors != 1 ? 's' : ''}, ${warnings} warning${
          warnings != 1 ? 's' : ''
        }`
      : '1 error, 0 warnings';
}

/**
 * Check if a list of `paths` (relative to `root`) exist. By default, `type` is
 * `"error"` and `errorMessage` is `"MissingFile"`.
 */
export function checkPathsExist(
  paths: readonly string[],
  root: string,
  reporterFactory: ReporterFactory,
  type: ReportType = 'error',
  errorMessage: 'MissingFile' | 'MissingDirectory' = 'MissingFile'
) {
  return Promise.all(
    paths.map(async (file) => {
      const filePath = `${root}/${file}`;
      try {
        await access(filePath);
      } catch {
        reporterFactory(filePath)(type, ErrorMessage[errorMessage]());
      }
    })
  );
}
