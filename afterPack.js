"use strict"

const builder = require("electron-builder")
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
  compression: "normal",
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
    win: {
      icon: "build/installation/icon.ico",
      target: "nsis"
    },
    mac: {
      category: "public.app-category.utilities",
      icon: "build/installation/icon.icns",
      hardenedRuntime: true,
      gatekeeperAssess: false,
      target: [
        "dmg",
        "zip"
      ],
      entitlements: "build/entitlements.mac.plist",
      entitlementsInherit: "build/entitlements.mac.plist",
      minimumSystemVersion: "10.10"
    },
    nsis: {
      oneClick: true,
      createDesktopShortcut: "always"
    },
    dmg: {
      sign: false,
      icon: "build/installation/volume.icns",
      title: "Install Publii"
    },
    publish: {
      provider: "generic",
      url: "https://dev-zen.com/publii-publish-test/",
      channel: "stable"
    }
  };

// Promise is returned
builder.build({
  targets: Platform.MAC.createTarget(),
  config: options
})
.then((result) => {
  console.log(JSON.stringify(result))
})
.catch((error) => {
  console.error(error)
});