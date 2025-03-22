/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `start-session` command */
  export type StartSession = ExtensionPreferences & {}
  /** Preferences accessible in the `stop-session` command */
  export type StopSession = ExtensionPreferences & {}
  /** Preferences accessible in the `extend-session` command */
  export type ExtendSession = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `start-session` command */
  export type StartSession = {}
  /** Arguments passed to the `stop-session` command */
  export type StopSession = {}
  /** Arguments passed to the `extend-session` command */
  export type ExtendSession = {}
}

