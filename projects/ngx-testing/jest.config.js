module.exports = {
  name: 'ngx-testing',
  coverageDirectory: '<rootDir>/coverage/ngx-testing',
  collectCoverageFrom: ['projects/ngx-testing/src/lib/**/*.ts'],
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
