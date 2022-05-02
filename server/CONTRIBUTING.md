# Contribution guide

## Developing  backend

You consider contributing changes to commitizen – thank you!
Please consider these guidelines when filing a pull request:

*  Commits follow the [Angular commit convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)
*  JavaScript is written using ES2015 features and above
*  2 spaces indentation
*  Features and bug fixes should be covered by test cases

## Creating releases

commitizen uses [semantic-release](https://github.com/semantic-release/semantic-release)
to release new versions automatically.

*  Commits of type `fix` or `improvement` will trigger bugfix releases, think `0.0.1`
*  Commits of type `improvement` will trigger feature improvement, think `0.0.1`
*  Commits of type `feat` will trigger feature releases, think `0.1.0`
*  Commits with `BREAKING CHANGE` in body or footer will trigger breaking releases, think `1.0.0`

All other commit types will trigger no new release.
