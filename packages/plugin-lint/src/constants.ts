/**
 * File extensions whose imports will be scrutinized by plugin-lint. Taken from
 * the TypeScript documentation. **Expects tsconfig with compiler options
 * `"allowJs": true` and `"module": "nodenext"` set.**
 */
export const sourceExtensionsThatSupportImports = ['ts', 'tsx', 'mjs', 'mts'];

/**
 * The default file extensions used by TypeScript, ESLint, and others. Taken
 * from the TypeScript documentation. **Expects tsconfig with compiler options
 * `"allowJs": true` and `"module": "nodenext"` set.**
 */
export const typescriptDefaultSourceExtensions = [
  ...sourceExtensionsThatSupportImports,
  'js',
  'jsx',
  'cjs',
  'cts',
  'd.ts',
  'd.mts',
  'd.cts'
];

/**
 * Glob pattern used by default to select Markdown files.
 */
export const defaultMarkdownGlob =
  '{{,.}*.md,!(node_modules)/**/{,.}*.md,.*/**/{,.}*.md}' as const;

/**
 * Globs that should always be passed to the `glob` function's `ignore` option.
 */
export const globIgnorePatterns = ['**/node_modules/**', '**/.git/**'] as const;

/**
 * Regular expression that matches lines containing links that may have been
 * erroneously disabled.
 */
export const disabledLinkRegex = /^.*\\\[[^\\]*]\\.*/gim;

/**
 * Required value of the `license` field in package.json
 */
export const pkgJsonLicense = 'MIT' as const;

/**
 * Files that must exist in all roots and sub-roots (relative paths)
 */
export const requiredFiles = ['LICENSE', 'README.md'] as const;

/**
 * Files that must exist in non sub-roots (relative paths)
 */
export const repoRootRequiredFiles = [
  '.codecov.yml',
  '.editorconfig',
  '.eslintrc.js',
  '.gitattributes',
  '.gitignore',
  '.prettierignore',
  '.spellcheckignore',
  'babel.config.js',
  'commitlint.config.js',
  'conventional.config.js',
  'jest.config.js',
  'lint-staged.config.js',
  'webpack.config.js',
  'prettier.config.js',
  'CONTRIBUTING.md',
  'SECURITY.md',
  '.github/ISSUE_TEMPLATE/BUG_REPORT.md',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/ISSUE_TEMPLATE/FEATURE_REQUEST.md',
  '.github/CODE_OF_CONDUCT.md',
  '.github/CODEOWNERS',
  '.github/dependabot.yml',
  '.github/pipeline.config.js',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/SUPPORT.md'
] as const;
/**
 * Directories that must exist in non sub-roots (relative paths)
 */
export const repoRootRequiredDirectories = [
  '.github',
  '.github/ISSUE_TEMPLATE',
  '.github/workflows',
  '.husky',
  'types'
] as const;

/**
 * Allowed experimental versions
 */
export const pkgVersionWhitelist = ['0.0.0-monorepo'] as const;

/**
 * Outdated "exports" field keys that should not be encountered in any context
 */
export const pkgJsonObsoleteEntryKeys = [
  'main',
  'module',
  'types',
  'typesVersions'
] as const;

/**
 * Outdated "scripts" field keys that should not be encountered in any context.
 * **Can be regular expressions or stings.**
 */
export const pkgJsonObsoleteScripts = [
  /^test-integration-webpack/,
  /^test-integration-browser/,
  'prepublishOnly',
  'postpublish',
  'repl',
  'preinstall',
  'postinstall',
  'fixup',
  'check-types',
  'publishGuard'
] as const;

/**
 * The parameters used to resolve Markdown urls.
 */
export type StandardUrlParameters = {
  user: string;
  repo: string;
  pkgName: string;
  flag?: string;
};

/**
 * The shape of a standard Markdown topmatter specification.
 */
export type StandardTopmatter = {
  [badgeName: string]: {
    label: string;
    url: (parameters: StandardUrlParameters) => string;
    title: string;
    link: { label: string; url: (parameters: StandardUrlParameters) => string };
  };
};

/**
 * The shape of a standard Markdown link specification.
 */
export type StandardLinks = {
  [linkName: string]: {
    label: string;
    url: (parameters: StandardUrlParameters) => string;
  };
};

export type Condition = 'monorepo' | 'polyrepo' | 'subroot';

/**
 * Standard Markdown topmatter (i.e. badges, surrounding comments, references)
 * for topmatter badges that appear in `README.md`. Note that order matters!
 *
 * Also note that, unlike an actual `StandardTopmatter` object, this has the
 * special `badge` and `comment` keys under which the appropriate topmatter is
 * described (each of which include the special `alt` and `condition` keys).
 */
export const markdownReadmeStandardTopmatter = {
  comment: {
    start: '<!-- badges-start -->',
    end: '<!-- badges-end -->'
  },
  badge: {
    blm: {
      conditions: ['monorepo', 'polyrepo', 'subroot'] as Condition[],
      label: 'badge-blm',
      alt: 'Black Lives Matter!',
      url: (_: StandardUrlParameters) => 'https://xunn.at/badge-blm',
      title: 'Join the movement!',
      link: {
        label: 'link-blm',
        url: (_: StandardUrlParameters) => 'https://xunn.at/donate-blm'
      }
    },
    maintenance: {
      conditions: ['monorepo', 'polyrepo', 'subroot'] as Condition[],
      label: 'badge-maintenance',
      alt: 'Maintenance status',
      url: (_: StandardUrlParameters) =>
        `https://img.shields.io/maintenance/active/${new Date().getFullYear()}`,
      title: 'Is this package maintained?',
      link: {
        label: 'link-maintenance',
        url: ({ user, repo }: StandardUrlParameters) =>
          `https://github.com/${user}/${repo}`
      }
    },
    lastCommit: {
      conditions: ['monorepo', 'polyrepo', 'subroot'] as Condition[],
      label: 'badge-last-commit',
      alt: 'Last commit timestamp',
      url: ({ user, repo }: StandardUrlParameters) =>
        `https://img.shields.io/github/last-commit/${user}/${repo}`,
      title: 'Latest commit timestamp',
      link: {
        label: 'link-last-commit',
        url: ({ user, repo }: StandardUrlParameters) =>
          `https://github.com/${user}/${repo}`
      }
    },
    issues: {
      conditions: ['monorepo', 'polyrepo', 'subroot'] as Condition[],
      label: 'badge-issues',
      alt: 'Open issues',
      url: ({ user, repo }: StandardUrlParameters) =>
        `https://img.shields.io/github/issues/${user}/${repo}`,
      title: 'Open issues',
      link: {
        label: 'link-issues',
        url: ({ user, repo }: StandardUrlParameters) =>
          `https://github.com/${user}/${repo}/issues?q=`
      }
    },
    pulls: {
      conditions: ['monorepo', 'polyrepo', 'subroot'] as Condition[],
      label: 'badge-pulls',
      alt: 'Pull requests',
      url: ({ user, repo }: StandardUrlParameters) =>
        `https://img.shields.io/github/issues-pr/${user}/${repo}`,
      title: 'Open pull requests',
      link: {
        label: 'link-pulls',
        url: ({ user, repo }: StandardUrlParameters) =>
          `https://github.com/${user}/${repo}/pulls`
      }
    },
    codecov: {
      conditions: ['polyrepo', 'subroot'] as Condition[],
      label: 'badge-codecov',
      alt: 'Codecov',
      url: ({ user, repo, flag }: StandardUrlParameters) =>
        `https://codecov.io/gh/${user}/${repo}/branch/main/graph/badge.svg${
          flag ? `?flag=${flag}` : ''
        }`,
      title: 'Is this package well-tested?',
      link: {
        label: 'link-codecov',
        url: ({ user, repo }: StandardUrlParameters) =>
          `https://codecov.io/gh/${user}/${repo}`
      }
    },
    license: {
      conditions: ['polyrepo', 'subroot'] as Condition[],
      label: 'badge-license',
      alt: 'Source license',
      url: ({ pkgName }: StandardUrlParameters) =>
        `https://img.shields.io/npm/l/${pkgName}`,
      title: "This package's source license",
      link: {
        label: 'link-license',
        url: ({ user, repo }: StandardUrlParameters) =>
          `https://github.com/${user}/${repo}/blob/main/LICENSE`
      }
    },
    npm: {
      conditions: ['polyrepo', 'subroot'] as Condition[],
      label: 'badge-npm',
      alt: 'NPM version',
      url: ({ pkgName }: StandardUrlParameters) =>
        `https://xunn.at/npm-pkg-version/${pkgName}`,
      title: 'Install this package using npm or yarn!',
      link: {
        label: 'link-npm',
        url: ({ pkgName }: StandardUrlParameters) =>
          `https://www.npmjs.com/package/${pkgName}`
      }
    },
    semanticRelease: {
      conditions: ['monorepo', 'polyrepo', 'subroot'] as Condition[],
      label: 'badge-semantic-release',
      alt: 'This repo uses semantic-release!',
      url: (_: StandardUrlParameters) => 'https://xunn.at/badge-semantic-release',
      title: 'This repo practices continuous integration and deployment!',
      link: {
        label: 'link-semantic-release',
        url: (_: StandardUrlParameters) =>
          'https://github.com/semantic-release/semantic-release'
      }
    }
  }
} as const;

/**
 * Standard Markdown topmatter (i.e. badges, surrounding comments, references)
 * for topmatter badges that appear in `SECURITY.md`. Note that order matters!
 */
export const markdownSecurityStandardTopmatter = {
  vulnerabilities: {
    label: 'badge-security',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://snyk.io/test/github/${user}/${repo}/badge.svg`,
    title: 'Number of vulnerabilities (scanned by Snyk)',
    link: {
      label: 'link-security',
      url: ({ user, repo }: StandardUrlParameters) =>
        `https://snyk.io/test/github/${user}/${repo}`
    }
  }
} as const;

/**
 * Standard Markdown topmatter (i.e. badges, surrounding comments, references)
 * for topmatter badges that appear in `SUPPORT.md`. Note that order matters!
 */
export const markdownSupportStandardTopmatter = {
  issuesResolution: {
    label: 'badge-issue-resolution',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://isitmaintained.com/badge/resolution/${user}/${repo}.svg`,
    title: 'Average time to resolve an issue',
    link: {
      label: 'link-issue-resolution',
      url: ({ user, repo }: StandardUrlParameters) =>
        `https://isitmaintained.com/project/${user}/${repo}`
    }
  },
  issuesPercentage: {
    label: 'badge-issue-percentage',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://isitmaintained.com/badge/open/${user}/${repo}.svg`,
    title: 'Open issues as a percentage of all issues',
    link: {
      label: 'link-issue-percentage',
      url: ({ user, repo }: StandardUrlParameters) =>
        `https://github.com/${user}/${repo}/issues?q=`
    }
  }
} as const;

/**
 * Standard Markdown reference links (i.e. links and references) for README.md
 */
export const markdownReadmeStandardLinks = {
  docs: { label: 'docs', url: (_: StandardUrlParameters) => 'docs' },
  chooseNewIssue: {
    label: 'choose-new-issue',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://github.com/${user}/${repo}/issues/new/choose`
  },
  prCompare: {
    label: 'pr-compare',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://github.com/${user}/${repo}/compare`
  },
  contributing: {
    label: 'contributing',
    url: (_: StandardUrlParameters) => 'CONTRIBUTING.md'
  },
  support: { label: 'support', url: (_: StandardUrlParameters) => '.github/SUPPORT.md' }
} as const;

/**
 * Standard Markdown reference links (i.e. links and references) for SECURITY.md
 */
export const markdownSecurityStandardLinks = {
  openIssues: {
    label: 'open-issues',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://github.com/${user}/${repo}/issues?q=`
  },
  chooseNewIssue: {
    label: 'choose-new-issue',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://github.com/${user}/${repo}/issues/new/choose`
  },
  securityMailTo: {
    label: 'security-mailto',
    url: (_: StandardUrlParameters) =>
      'mailto:security@ergodark.com?subject=ALERT%3A%20SECURITY%20INCIDENT%3A%20%28five%20word%20summary%29'
  }
} as const;

/**
 * Standard Markdown reference links (i.e. links and references) for SUPPORT.md
 */
export const markdownSupportStandardLinks = {
  openIssues: {
    label: 'open-issues',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://github.com/${user}/${repo}/issues?q=`
  },
  githubBlog: {
    label: 'github-blog',
    url: (_: StandardUrlParameters) =>
      'https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments'
  },
  chooseNewIssue: {
    label: 'choose-new-issue',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://github.com/${user}/${repo}/issues/new/choose`
  }
} as const;

/**
 * Standard Markdown reference links (i.e. links and references) for CONTRIBUTING.md
 */
export const markdownContributingStandardLinks = {
  howToContribute: {
    label: 'how-to-contribute',
    url: (_: StandardUrlParameters) =>
      'https://www.dataschool.io/how-to-contribute-on-github'
  },
  codeOfConduct: {
    label: 'code-of-conduct',
    url: (_: StandardUrlParameters) => '/.github/CODE_OF_CONDUCT.md'
  },
  githubActions: {
    label: 'github-actions',
    url: (_: StandardUrlParameters) => 'https://github.com/features/actions'
  },
  HuskyCl: {
    label: 'husky-cl',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://github.com/${user}/${repo}/tree/main/.husky`
  },
  ghaCi: {
    label: 'gha-ci',
    url: (_: StandardUrlParameters) => '.github/workflows/build-test.yml'
  },
  projector: {
    label: 'projector',
    url: (_: StandardUrlParameters) => 'https://github.com/Xunnamius/projector#readme'
  },
  pkgDebug: {
    label: 'pkg-debug',
    url: (_: StandardUrlParameters) => 'https://www.npmjs.com/package/debug'
  },
  pkgDebugWildcards: {
    label: 'pkg-debug-wildcards',
    url: (_: StandardUrlParameters) => 'https://www.npmjs.com/package/debug#wildcards'
  },
  fork: {
    label: 'fork',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://github.com/${user}/${repo}/fork`
  },
  howToClone: {
    label: 'how-to-clone',
    url: (_: StandardUrlParameters) =>
      'https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository'
  },
  npmCi: {
    label: 'npm-ci',
    url: (_: StandardUrlParameters) => 'https://docs.npmjs.com/cli/v6/commands/npm-ci'
  },
  prCompare: {
    label: 'pr-compare',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://github.com/${user}/${repo}/compare`
  },
  chooseNewIssue: {
    label: 'choose-new-issue',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://github.com/${user}/${repo}/issues/new/choose`
  },
  openIssues: {
    label: 'open-issues',
    url: ({ user, repo }: StandardUrlParameters) =>
      `https://github.com/${user}/${repo}/issues?q=`
  },
  atomicCommits: {
    label: 'atomic-commits',
    url: (_: StandardUrlParameters) =>
      'https://www.codewithjason.com/atomic-commits-testing/'
  },
  codecov: {
    label: 'codecov',
    url: (_: StandardUrlParameters) => 'https://about.codecov.io/'
  },
  conventionalCommits: {
    label: 'conventional-commits',
    url: (_: StandardUrlParameters) =>
      'https://www.conventionalcommits.org/en/v1.0.0/#summary'
  },
  cosmeticCommits: {
    label: 'cosmetic-commits',
    url: (_: StandardUrlParameters) =>
      'https://github.com/rails/rails/pull/13771#issuecomment-32746700'
  }
} as const;

/**
 * TSConfig files that must exist in polyrepo roots (relative paths)
 */
export const polyrepoTsconfigFiles = [
  'tsconfig.json',
  'tsconfig.docs.json',
  'tsconfig.eslint.json',
  'tsconfig.lint.json',
  'tsconfig.types.json'
] as const;

/**
 * TSConfig files that must exist in monorepo roots (relative paths)
 */
export const monorepoRootTsconfigFiles = [
  'tsconfig.json',
  'tsconfig.lint.json',
  'tsconfig.eslint.json'
] as const;

/**
 * TSConfig files that must exist in sub-roots (relative paths)
 */
export const subRootTsconfigFiles = [
  'tsconfig.docs.json',
  'tsconfig.lint.json',
  'tsconfig.types.json'
] as const;

/**
 * Script names that must exist in polyrepo roots
 */
export const polyrepoScripts = [
  'build-changelog',
  'build-dist',
  'build-docs',
  'build-stats',
  'build',
  'clean',
  'format',
  'lint-all',
  'lint',
  'list-tasks',
  'prepare',
  'test-all',
  'test-integration',
  'test-repeat-all',
  'test-repeat-unit',
  'test-unit',
  'test'
] as const;

/**
 * Script names that must exist in monorepo roots
 */
export const monorepoRootScripts = [
  'clean',
  'format',
  'lint-all',
  'lint',
  'list-tasks',
  'prepare',
  'test-all',
  'test-integration',
  'test-repeat-all',
  'test-repeat-unit',
  'test-unit',
  'test'
] as const;

/**
 * Script names that must exist in sub-roots
 */
export const subRootScripts = [
  'build-changelog',
  'build-dist',
  'build-docs',
  'build-stats',
  'build',
  'clean',
  'format',
  'lint-all',
  'lint',
  'list-tasks',
  'test-all',
  'test-integration',
  'test-repeat-all',
  'test-repeat-unit',
  'test-unit',
  'test'
] as const;

/**
 * Additional script names that must exist in Next.js project roots (i.e.
 * projects containing a `next.config.js` script)
 */
export const nextjsProjectRootAdditionalScripts = ['dev', 'test-e2e', 'start'] as const;

/**
 * Required fields in all roots and sub-roots
 */
export const globalPkgJsonRequiredFields = [
  'homepage',
  'repository',
  'license',
  'author',
  'engines',
  'type',
  'scripts'
] as const;

/**
 * Additionally required fields in monorepo sub-roots and polyrepo roots
 */
export const nonMonoRootPkgJsonRequiredFields = ['description'] as const;

/**
 * Additionally required fields in monorepo sub-roots and polyrepo roots when
 * "private" != `true`
 */
export const publicPkgJsonRequiredFields = [
  'name',
  'version',
  'keywords',
  'sideEffects',
  'exports',
  'files',
  'publishConfig'
] as const;

/**
 * Required "files" field values ("absolute" relative paths)
 */
export const pkgJsonRequiredFiles = [
  '/dist',
  '/LICENSE',
  '/package.json',
  '/README.md'
] as const;

/**
 * Required "exports" field keys.
 */
export const pkgJsonRequiredExports = ['./package', './package.json'] as const;
