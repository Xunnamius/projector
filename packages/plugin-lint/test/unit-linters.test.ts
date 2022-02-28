import * as Linters from '../src/linters';
import { Fixtures } from 'testverse/fixtures';
import { toss } from 'toss-expression';
import { ErrorMessage } from '../src/errors';
import { clearPackageJsonCache } from 'pkgverse/core/src/project-utils';
import escapeRegexp from 'escape-string-regexp';

const stringContainingErrorMessage = (currentFile: string, errorMessage: string) => {
  return expect.stringMatching(
    RegExp(
      `^.*${escapeRegexp(currentFile)}(?!/).*(?:\n  .*?)+ ${escapeRegexp(errorMessage)}$`,
      'm'
    )
  );
};

beforeEach(() => {
  clearPackageJsonCache();
});

describe('::runProjectLinter', () => {
  it('errors when the project is not a git repository', async () => {
    expect.hasAssertions();

    await expect(
      Linters.runProjectLinter({ rootDir: '/does/not/exist' })
    ).resolves.toStrictEqual({
      success: false,
      summary: expect.stringContaining('1 error, 0 warnings'),
      output: stringContainingErrorMessage(
        '/does/not/exist',
        ErrorMessage.NotAGitRepository()
      )
    });
  });

  it('errors when package.json file is missing', async () => {
    expect.hasAssertions();

    await expect(
      Linters.runProjectLinter({ rootDir: Fixtures.badPolyrepoNoPackageJson.root })
    ).resolves.toStrictEqual({
      success: false,
      summary: expect.stringContaining('1 error, 0 warnings'),
      output: stringContainingErrorMessage(
        `${Fixtures.badPolyrepoNoPackageJson.root}/package.json`,
        ErrorMessage.FatalMissingFile()
      )
    });
  });

  it('errors when package.json file is unparsable', async () => {
    expect.hasAssertions();

    jest.spyOn(JSON, 'parse').mockImplementation(() => toss(new Error('badness')));

    await expect(
      Linters.runProjectLinter({ rootDir: Fixtures.goodMonorepo.root })
    ).resolves.toStrictEqual({
      success: false,
      summary: expect.stringContaining('1 error, 0 warnings'),
      output: stringContainingErrorMessage(
        `${Fixtures.goodMonorepo.root}/package.json`,
        ErrorMessage.PackageJsonUnparsable()
      )
    });
  });

  it('errors when the dist directory or its subdirectories contain .tsbuildinfo files', async () => {
    expect.hasAssertions();

    const monorepo = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    expect(monorepo.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/dist/tsconfig.fake.tsbuildinfo`,
        ErrorMessage.IllegalItemInDirectory(
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/dist`
        )
      )
    );

    expect(monorepo.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/dist/sub-dir/tsconfig.fake2.tsbuildinfo`,
        ErrorMessage.IllegalItemInDirectory(
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/dist`
        )
      )
    );

    const polyrepo = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepo.root
    });

    expect(polyrepo.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepo.root}/dist/tsconfig.fake.tsbuildinfo`,
        ErrorMessage.IllegalItemInDirectory(`${Fixtures.badPolyrepo.root}/dist`)
      )
    );
  });

  it('errors when package.json does not contain necessary fields', async () => {
    expect.hasAssertions();

    const expected = (output: string | undefined, path: string) => {
      Linters.globalPkgJsonRequiredFields.forEach((field) => {
        expect(output).toStrictEqual(
          stringContainingErrorMessage(path, ErrorMessage.PackageJsonMissingKey(field))
        );
      });
    };

    const monorepo = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    expected(monorepo.output, `${Fixtures.badMonorepo.root}/package.json`);

    expected(
      monorepo.output,
      `${Fixtures.badMonorepo.unnamedPkgMapData[1][1].root}/package.json`
    );

    expected(
      (
        await Linters.runProjectLinter({
          rootDir: `${Fixtures.badPolyrepo.root}/package.json`
        })
      ).output,
      `${Fixtures.badPolyrepo.root}/package.json`
    );
  });

  it('errors when package.json does not contain certain fields unless "private" field is set to "true"', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('errors when the same dependency appears under both "dependencies" and "devDependencies" fields in package.json', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('errors when package.json contains the "files" field but its array is missing necessary values', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('errors when package.json "exports" field is missing self-referencing entry points', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('errors when missing LICENSE or README.md files', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('errors when unpublished git commits have certain keywords in their subject', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('errors when any "exports" entry points in package.json point to files that do not exist', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when missing certain tsconfig files in a polyrepo or monorepo root', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when missing certain other tsconfig files in a monorepo sub-root', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json "license" field is not "MIT"', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json version field is experimental', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json contains outdated entry point fields', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json missing "engines.node" field', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json "engines.node" field is not maintained/LTS semver', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json contains a pinned dependency/devDependency', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json contains a dist-tag dependency/devDependency', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json "config.docs.entry" is missing', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when README.md is missing topmatter', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
    // TODO: warn about unknown topmatter
    // TODO: ignore some known topmatter that isn't universally applicable
    // TODO: bundlephobia size and treeshakability badges are replaced
    // TODO:     (xunn.io size solution should cache result for 24 hours)
  });

  it('warns when README.md topmatter is incorrectly configured', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when README.md is missing standard links', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when README.md standard links are incorrectly configured', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  describe('(monorepo checks)', () => {
    it('errors when a sub-root package.json file is missing', async () => {
      expect.hasAssertions();

      const monorepo = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepoNonPackageDir.root
      });

      Fixtures.badMonorepoNonPackageDir.brokenPkgRoots.forEach((pkgRoot) => {
        expect(monorepo.output).toStrictEqual(
          stringContainingErrorMessage(
            `${pkgRoot}/package.json`,
            ErrorMessage.MissingFile()
          )
        );
      });
    });

    it('errors when a sub-root package.json file is unparsable', async () => {
      expect.hasAssertions();

      const parse = JSON.parse;
      jest
        .spyOn(JSON, 'parse')
        .mockImplementationOnce((...args) => parse(...args))
        .mockImplementationOnce((...args) => parse(...args))
        .mockImplementationOnce(() => toss(new Error('badness')));

      await expect(
        Linters.runProjectLinter({ rootDir: Fixtures.goodMonorepo.root })
      ).resolves.toStrictEqual({
        success: false,
        summary: expect.stringContaining('1 error, 0 warnings'),
        output: stringContainingErrorMessage(
          `${Fixtures.goodMonorepo.namedPkgMapData[1][1].root}/package.json`,
          ErrorMessage.PackageJsonUnparsable()
        )
      });
    });

    it('errors if two sub-roots share the same name', async () => {
      expect.hasAssertions();

      const monorepo = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepoDuplicateName.root
      });

      expect(monorepo.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepoDuplicateName.root}/pkg/pkg-1`,
          ErrorMessage.DuplicatePackageName(
            'pkg',
            `${Fixtures.badMonorepoDuplicateName.root}/pkg/pkg-2`
          )
        )
      );

      expect(monorepo.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepoDuplicateName.root}/pkg/pkg-2`,
          ErrorMessage.DuplicatePackageName(
            'pkg',
            `${Fixtures.badMonorepoDuplicateName.root}/pkg/pkg-1`
          )
        )
      );
    });

    it('errors if two unnamed sub-roots share the same package-id', async () => {
      expect.hasAssertions();

      const monorepo = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepoDuplicateId.root
      });

      expect(monorepo.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepoDuplicateId.root}/packages-1/pkg-1`,
          ErrorMessage.DuplicatePackageId(
            'pkg-1',
            `${Fixtures.badMonorepoDuplicateId.root}/packages-2/pkg-1`
          )
        )
      );

      expect(monorepo.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepoDuplicateId.root}/packages-2/pkg-1`,
          ErrorMessage.DuplicatePackageId(
            'pkg-1',
            `${Fixtures.badMonorepoDuplicateId.root}/packages-1/pkg-1`
          )
        )
      );
    });
  });

  describe('(non-sub-root checks)', () => {
    it('warns when missing certain tooling/configuration files', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
    });

    it('warns when missing release.config.js unless "private" field is set to "true"', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
    });

    it('warns when missing GitHub tooling directories', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
    });

    it('warns when SECURITY.md or .github/SUPPORT.md are missing topmatter', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
      // TODO: warn about unknown topmatter
      // TODO: ignore some known topmatter that isn't universally applicable
      // TODO: bundlephobia size and treeshakability badges are replaced
      // TODO:     (xunn.io size solution should cache result for 24 hours)
    });

    it('warns when SECURITY.md or .github/SUPPORT.md topmatter is incorrectly configured', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
    });

    it('warns when CONTRIBUTING.md, SECURITY.md, or .github/SUPPORT.md are missing standard links', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
    });

    it('warns when CONTRIBUTING.md, SECURITY.md, or .github/SUPPORT.md standard links are incorrectly configured', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
    });
  });

  describe('(monorepo root checks)', () => {
    it('warns when package.json contains "dependencies" or "version" fields unless a next.config.js file exists', async () => {
      expect.hasAssertions();
      // TODO: monorepo root but does NOT fail on polyrepo or sub-roots
    });

    it('correctly detects, collates, and counts warnings and errors across entire monorepo', async () => {
      expect.hasAssertions();
      // TODO: monorepo (amalgum) but NOT fail on ok sub-root
    });
  });

  describe('(sub-root checks)', () => {
    it('errors when sub-root code imports another sub-root without also listing it under "dependency" in package.json', async () => {
      expect.hasAssertions();
      // TODO: sub-root but does NOT fail on monorepo root or polyrepo. However,
      // TODO: does NOT error on unlisted self-referential imports
    });

    it('warns when package.json contains "devDependencies" field', async () => {
      expect.hasAssertions();
      // TODO: sub-root but does NOT fail on monorepo root or polyrepo
    });
  });

  it('only executes certain checks when in pre-push mode', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo (both amalgum)
  });

  it('correctly detects, collates, and counts warnings and errors in polyrepo', async () => {
    expect.hasAssertions();
    // TODO: polyrepo (amalgum)
  });
});

describe('::runTypescriptLinter', () => {
  it('correctly parses different combinations of error and warning messages', async () => {
    expect.hasAssertions();
    // TODO: Including no message and non-parsable message + success == false
  });
});

describe('::runEslintLinter', () => {
  it('correctly parses different combinations of error and warning messages', async () => {
    expect.hasAssertions();
    // TODO: Including no message and non-parsable message + success == false
  });
});

describe('::runRemarkLinter', () => {
  it('correctly parses different combinations of error and warning messages', async () => {
    expect.hasAssertions();
    // TODO: Including no message and non-parsable message + success == false
  });
});
