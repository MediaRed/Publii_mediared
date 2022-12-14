"use strict"

const builder = require("electron-builder")
const electronRebuild = require("@electron/rebuild")
const Platform = builder.Platform

// Let's get that intellisense working
/**
* @type {import('electron-builder').Configuration}
* @see https://www.electron.build/configuration/configuration
*/
const options = {
  protocols: {
    name: "Deeplink Example",
    // Don't forget to set `MimeType: "x-scheme-handler/deeplink"` for `linux.desktop` entry!
    schemes: [
      "deeplink"
    ]
  },

  // "store” | “normal” | "maximum". - For testing builds, use 'store' to reduce build time significantly.
  compression: "store",
  removePackageScripts: true,

    afterSign: async (context) => {
      // Mac releases require hardening+notarization: https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution
      if (!isDebug && context.electronPlatformName === "darwin") {
        await notarizeMac(context)
      }
    },
    artifactBuildStarted: (context) => {
      identifyLinuxPackage(context)
    },
    afterAllArtifactBuild: (buildResult) => {
      return stampArtifacts(buildResult)
    },
  // force arch build if using electron-rebuild
    beforeBuild: async (context) => {
      const { appDir, electronVersion, arch } = context
      await electronRebuild.rebuild({ buildPath: appDir, electronVersion, arch })
      return false
    },
    nodeGypRebuild: false,
    buildDependenciesFromSource: false,

    directories: {
      output: "dist",
      buildResources: "build"
    },
    files: [
      "**/*",
      "dist/**/*",
      "!app/node_modules/devtron/**/*",
      "!app/node_modules/accessibility-developer-tools/**/*",
      "!app/node_modules/babel*",
      "!app/node_modules/postcss*",
      "!app/node_modules/asn1/**/*",
      "!app/node_modules/electron-*",
      "app/node_modules/publii-block-editor"
    ],
    linux: {
      mimeTypes: ["x-scheme-handler/deeplink"],
      icon: "./build/installation/icon.icns",
      target: [
        "rpm",
        "AppImage",
        "deb"
      ],
      category: "Development",
      description: "Static Site CMS",
      executableName: "Publii"
    },
    deb: {
      depends: [
        "libsecret-1-dev",
        "gnome-keyring"
      ]
    },
    rpm: {
      depends: [
        "libsecret-devel",
        "gnome-keyring"
      ]
    },
    appImage: {
      license: "license.txt"
    },
    publish: {
      provider: "generic",
      url: "https://dev-zen.com/publii-publish-test/",
      channel: "stable"
    }
  };

// Promise is returned
const targets = new Map()
    .set(Platform.LINUX, new Map())
    .set(Platform.WINDOWS, new Map())
    .set(Platform.MAC, new Map());

builder.build({
  targets,
  config: options
})
.then((result) => {
  console.log(JSON.stringify(result))
})
.catch((error) => {
  console.error(error)
});