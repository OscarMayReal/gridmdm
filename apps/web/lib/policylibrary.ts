export const PolicyLibrary = {
    "schema_version": "1.1.0",
    "description": "Reference catalogue of manageable dconf/GSettings keys for MDM policy authoring",
    "categories": [
        {
            "id": "screen_and_lock",
            "icon": "monitor",
            "name": "Screen & Lock",
            "description": "Controls screensaver activation, screen locking, and idle behaviour",
            "groups": [
                {
                    "id": "idle",
                    "name": "Idle Timeout",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/session/idle-delay",
                            "friendly_name": "Screen Idle Delay",
                            "description": "Time in seconds before the screen is considered idle. Set to 0 to disable.",
                            "value_type": "uint32",
                            "default_value": 300,
                            "enum": null,
                            "icon": "clock"
                        },
                        {
                            "key": "/org/gnome/desktop/screensaver/idle-activation-enabled",
                            "friendly_name": "Enable Screensaver on Idle",
                            "description": "Whether the screensaver activates automatically when the session is idle.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "image"
                        }
                    ]
                },
                {
                    "id": "lock",
                    "name": "Screen Lock",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/screensaver/lock-enabled",
                            "friendly_name": "Lock Screen on Screensaver",
                            "description": "Whether the screen locks when the screensaver activates.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "lock"
                        },
                        {
                            "key": "/org/gnome/desktop/screensaver/lock-delay",
                            "friendly_name": "Lock Delay After Screensaver",
                            "description": "Seconds after the screensaver activates before the screen locks.",
                            "value_type": "uint32",
                            "default_value": 0,
                            "enum": null,
                            "icon": "hourglass"
                        },
                        {
                            "key": "/org/gnome/desktop/lockdown/disable-lock-screen",
                            "friendly_name": "Disable Lock Screen",
                            "description": "Prevents the user from manually locking the screen. Does not affect automatic locking.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "lock-open"
                        }
                    ]
                },
                {
                    "id": "screensaver_appearance",
                    "name": "Screensaver Appearance",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/screensaver/picture-uri",
                            "friendly_name": "Screensaver Background Image",
                            "description": "URI of the image to use as the screensaver background.",
                            "value_type": "string",
                            "default_value": "",
                            "enum": null,
                            "icon": "image"
                        },
                        {
                            "key": "/org/gnome/desktop/screensaver/primary-color",
                            "friendly_name": "Screensaver Primary Colour",
                            "description": "Primary colour used when no image is set, as a hex colour string.",
                            "value_type": "string",
                            "default_value": "#000000",
                            "enum": null,
                            "icon": "palette"
                        }
                    ]
                }
            ]
        },
        {
            "id": "power_management",
            "icon": "power",
            "name": "Power Management",
            "description": "Controls sleep, hibernate, and power button behaviour for AC and battery operation",
            "groups": [
                {
                    "id": "sleep_ac",
                    "name": "Sleep (AC Power)",
                    "settings": [
                        {
                            "key": "/org/gnome/settings-daemon/plugins/power/sleep-inactive-ac-timeout",
                            "friendly_name": "Sleep Timeout (AC)",
                            "description": "Seconds of inactivity before the device sleeps when on AC power. Set to 0 to disable.",
                            "value_type": "int32",
                            "default_value": 3600,
                            "enum": null,
                            "icon": "clock"
                        },
                        {
                            "key": "/org/gnome/settings-daemon/plugins/power/sleep-inactive-ac-type",
                            "friendly_name": "Sleep Action (AC)",
                            "description": "Action to take when the AC sleep timeout is reached.",
                            "value_type": "string",
                            "default_value": "suspend",
                            "enum": [
                                { "value": "nothing", "label": "Do Nothing" },
                                { "value": "suspend", "label": "Suspend" },
                                { "value": "hibernate", "label": "Hibernate" },
                                { "value": "shutdown", "label": "Shut Down" }
                            ],
                            "icon": "power"
                        }
                    ]
                },
                {
                    "id": "sleep_battery",
                    "name": "Sleep (Battery)",
                    "settings": [
                        {
                            "key": "/org/gnome/settings-daemon/plugins/power/sleep-inactive-battery-timeout",
                            "friendly_name": "Sleep Timeout (Battery)",
                            "description": "Seconds of inactivity before the device sleeps when on battery. Set to 0 to disable.",
                            "value_type": "int32",
                            "default_value": 1200,
                            "enum": null,
                            "icon": "clock"
                        },
                        {
                            "key": "/org/gnome/settings-daemon/plugins/power/sleep-inactive-battery-type",
                            "friendly_name": "Sleep Action (Battery)",
                            "description": "Action to take when the battery sleep timeout is reached.",
                            "value_type": "string",
                            "default_value": "suspend",
                            "enum": [
                                { "value": "nothing", "label": "Do Nothing" },
                                { "value": "suspend", "label": "Suspend" },
                                { "value": "hibernate", "label": "Hibernate" },
                                { "value": "shutdown", "label": "Shut Down" }
                            ],
                            "icon": "power"
                        },
                        {
                            "key": "/org/gnome/settings-daemon/plugins/power/percentage-critical",
                            "friendly_name": "Critical Battery Level (%)",
                            "description": "Battery percentage at which the critical battery action is triggered.",
                            "value_type": "int32",
                            "default_value": 3,
                            "enum": null,
                            "icon": "battery"
                        },
                        {
                            "key": "/org/gnome/settings-daemon/plugins/power/critical-battery-action",
                            "friendly_name": "Critical Battery Action",
                            "description": "Action taken when battery reaches the critical level.",
                            "value_type": "string",
                            "default_value": "hibernate",
                            "enum": [
                                { "value": "nothing", "label": "Do Nothing" },
                                { "value": "suspend", "label": "Suspend" },
                                { "value": "hibernate", "label": "Hibernate" },
                                { "value": "shutdown", "label": "Shut Down" }
                            ],
                            "icon": "alert-triangle"
                        }
                    ]
                },
                {
                    "id": "power_buttons",
                    "name": "Power Button & Lid",
                    "settings": [
                        {
                            "key": "/org/gnome/settings-daemon/plugins/power/power-button-action",
                            "friendly_name": "Power Button Action",
                            "description": "Action when the physical power button is pressed.",
                            "value_type": "string",
                            "default_value": "interactive",
                            "enum": [
                                { "value": "nothing", "label": "Do Nothing" },
                                { "value": "suspend", "label": "Suspend" },
                                { "value": "hibernate", "label": "Hibernate" },
                                { "value": "shutdown", "label": "Shut Down" },
                                { "value": "interactive", "label": "Show Power Menu" }
                            ],
                            "icon": "power"
                        },
                        {
                            "key": "/org/gnome/settings-daemon/plugins/power/lid-close-ac-action",
                            "friendly_name": "Lid Close Action (AC)",
                            "description": "Action when the laptop lid is closed on AC power.",
                            "value_type": "string",
                            "default_value": "suspend",
                            "enum": [
                                { "value": "nothing", "label": "Do Nothing" },
                                { "value": "suspend", "label": "Suspend" },
                                { "value": "hibernate", "label": "Hibernate" },
                                { "value": "shutdown", "label": "Shut Down" }
                            ],
                            "icon": "laptop"
                        },
                        {
                            "key": "/org/gnome/settings-daemon/plugins/power/lid-close-battery-action",
                            "friendly_name": "Lid Close Action (Battery)",
                            "description": "Action when the laptop lid is closed on battery power.",
                            "value_type": "string",
                            "default_value": "suspend",
                            "enum": [
                                { "value": "nothing", "label": "Do Nothing" },
                                { "value": "suspend", "label": "Suspend" },
                                { "value": "hibernate", "label": "Hibernate" },
                                { "value": "shutdown", "label": "Shut Down" }
                            ],
                            "icon": "laptop"
                        }
                    ]
                },
                {
                    "id": "display_power",
                    "name": "Display Power",
                    "settings": [
                        {
                            "key": "/org/gnome/settings-daemon/plugins/power/idle-dim",
                            "friendly_name": "Dim Display When Idle",
                            "description": "Whether to dim the display before the idle timeout is reached.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "sun-dim"
                        },
                        {
                            "key": "/org/gnome/settings-daemon/plugins/power/ambient-enabled",
                            "friendly_name": "Automatic Brightness (Ambient)",
                            "description": "Automatically adjust screen brightness based on ambient light sensor.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "sun"
                        }
                    ]
                }
            ]
        },
        {
            "id": "lockdown",
            "icon": "lock",
            "name": "Lockdown & Restrictions",
            "description": "Restricts access to system features and administrative functions",
            "groups": [
                {
                    "id": "session_lockdown",
                    "name": "Session Controls",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/lockdown/disable-log-out",
                            "friendly_name": "Disable Log Out",
                            "description": "Hides the log out option from menus. Does not prevent session termination by other means.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "log-out"
                        },
                        {
                            "key": "/org/gnome/desktop/lockdown/disable-user-switching",
                            "friendly_name": "Disable User Switching",
                            "description": "Prevents switching to another user session without logging out first.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "users"
                        },
                        {
                            "key": "/org/gnome/desktop/lockdown/disable-command-line",
                            "friendly_name": "Disable Command Line Access",
                            "description": "Prevents the user from accessing a terminal or running arbitrary commands.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "terminal"
                        }
                    ]
                },
                {
                    "id": "application_lockdown",
                    "name": "Application Restrictions",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/lockdown/disable-application-handlers",
                            "friendly_name": "Disable Application Handler Changes",
                            "description": "Prevents the user from changing default application associations.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "app-window"
                        },
                        {
                            "key": "/org/gnome/desktop/lockdown/disable-save-to-disk",
                            "friendly_name": "Disable Save to Disk",
                            "description": "Prevents applications from saving files to disk. Intended for kiosk environments.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "save"
                        },
                        {
                            "key": "/org/gnome/desktop/lockdown/disable-printing",
                            "friendly_name": "Disable Printing",
                            "description": "Prevents the user from printing from any application.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "printer"
                        },
                        {
                            "key": "/org/gnome/desktop/lockdown/disable-print-setup",
                            "friendly_name": "Disable Printer Setup",
                            "description": "Prevents the user from adding, removing, or modifying printers.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "settings"
                        }
                    ]
                },
                {
                    "id": "settings_lockdown",
                    "name": "Settings Restrictions",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/lockdown/disable-settings",
                            "friendly_name": "Disable GNOME Settings",
                            "description": "Prevents the user from opening the GNOME Settings application entirely.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "settings"
                        }
                    ]
                }
            ]
        },
        {
            "id": "privacy",
            "icon": "shield",
            "name": "Privacy",
            "description": "Controls telemetry, activity tracking, and data retention behaviour",
            "groups": [
                {
                    "id": "telemetry",
                    "name": "Telemetry & Reporting",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/privacy/report-technical-problems",
                            "friendly_name": "Send Crash Reports",
                            "description": "Automatically send crash and technical problem reports.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "alert-circle"
                        },
                        {
                            "key": "/org/gnome/desktop/privacy/send-software-usage-stats",
                            "friendly_name": "Send Usage Statistics",
                            "description": "Send anonymous software usage statistics to GNOME.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "bar-chart-3"
                        }
                    ]
                },
                {
                    "id": "activity",
                    "name": "Activity & History",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/privacy/remember-recent-files",
                            "friendly_name": "Remember Recent Files",
                            "description": "Whether to keep a history of recently opened files.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "history"
                        },
                        {
                            "key": "/org/gnome/desktop/privacy/recent-files-max-age",
                            "friendly_name": "Recent Files Retention (days)",
                            "description": "Number of days to retain recent file history. Set to -1 for unlimited.",
                            "value_type": "int32",
                            "default_value": 30,
                            "enum": null,
                            "icon": "calendar"
                        },
                        {
                            "key": "/org/gnome/desktop/privacy/remember-app-usage",
                            "friendly_name": "Remember Application Usage",
                            "description": "Whether to track application usage for search and suggestions.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "activity"
                        }
                    ]
                },
                {
                    "id": "cleanup",
                    "name": "Automatic Cleanup",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/privacy/remove-old-trash-files",
                            "friendly_name": "Auto-Empty Trash",
                            "description": "Automatically remove files from the trash after a set number of days.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "trash-2"
                        },
                        {
                            "key": "/org/gnome/desktop/privacy/remove-old-temp-files",
                            "friendly_name": "Auto-Remove Temp Files",
                            "description": "Automatically remove temporary files after a set number of days.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "file-x"
                        },
                        {
                            "key": "/org/gnome/desktop/privacy/old-files-age",
                            "friendly_name": "Auto-Cleanup Age (days)",
                            "description": "Age in days before trash and temp files are automatically removed, when auto-cleanup is enabled.",
                            "value_type": "uint32",
                            "default_value": 30,
                            "enum": null,
                            "icon": "clock"
                        }
                    ]
                },
                {
                    "id": "location",
                    "name": "Location",
                    "settings": [
                        {
                            "key": "/org/gnome/system/location/enabled",
                            "friendly_name": "Enable Location Services",
                            "description": "Master switch for location services. When disabled, no application can access location data.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "map-pin"
                        }
                    ]
                }
            ]
        },
        {
            "id": "desktop_appearance",
            "icon": "brush",
            "name": "Desktop Appearance",
            "description": "Controls wallpaper, themes, fonts, and visual style",
            "groups": [
                {
                    "id": "wallpaper",
                    "name": "Wallpaper",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/background/picture-uri",
                            "friendly_name": "Wallpaper (Light Mode)",
                            "description": "URI of the wallpaper image used in light mode. Supports file:// URIs.",
                            "value_type": "string",
                            "default_value": "file:///usr/share/backgrounds/gnome/default.jpg",
                            "enum": null,
                            "icon": "image"
                        },
                        {
                            "key": "/org/gnome/desktop/background/picture-uri-dark",
                            "friendly_name": "Wallpaper (Dark Mode)",
                            "description": "URI of the wallpaper image used in dark mode.",
                            "value_type": "string",
                            "default_value": "file:///usr/share/backgrounds/gnome/default-dark.jpg",
                            "enum": null,
                            "icon": "moon"
                        },
                        {
                            "key": "/org/gnome/desktop/background/picture-options",
                            "friendly_name": "Wallpaper Scaling",
                            "description": "How the wallpaper image is scaled to fit the screen.",
                            "value_type": "string",
                            "default_value": "zoom",
                            "enum": [
                                { "value": "none", "label": "No Scaling (Tiled)" },
                                { "value": "wallpaper", "label": "Tile" },
                                { "value": "centered", "label": "Centred" },
                                { "value": "scaled", "label": "Scaled (Fit)" },
                                { "value": "stretched", "label": "Stretched (Fill)" },
                                { "value": "zoom", "label": "Zoom (Crop to Fill)" },
                                { "value": "spanned", "label": "Spanned (Multi-Monitor)" }
                            ],
                            "icon": "scaling"
                        },
                        {
                            "key": "/org/gnome/desktop/background/primary-color",
                            "friendly_name": "Background Primary Colour",
                            "description": "Solid or gradient primary colour shown when no image is set.",
                            "value_type": "string",
                            "default_value": "#000000",
                            "enum": null,
                            "icon": "palette"
                        }
                    ]
                },
                {
                    "id": "theme",
                    "name": "Theme",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/interface/gtk-theme",
                            "friendly_name": "GTK Theme",
                            "description": "Name of the GTK theme to apply to all applications.",
                            "value_type": "string",
                            "default_value": "Adwaita",
                            "enum": null,
                            "icon": "palette"
                        },
                        {
                            "key": "/org/gnome/desktop/interface/icon-theme",
                            "friendly_name": "Icon Theme",
                            "description": "Name of the icon theme to apply system-wide.",
                            "value_type": "string",
                            "default_value": "Adwaita",
                            "enum": null,
                            "icon": "square"
                        },
                        {
                            "key": "/org/gnome/desktop/interface/cursor-theme",
                            "friendly_name": "Cursor Theme",
                            "description": "Name of the cursor theme to apply system-wide.",
                            "value_type": "string",
                            "default_value": "Adwaita",
                            "enum": null,
                            "icon": "mouse-pointer-2"
                        },
                        {
                            "key": "/org/gnome/desktop/interface/color-scheme",
                            "friendly_name": "Colour Scheme",
                            "description": "Preferred colour scheme. Applications that support it will follow this setting.",
                            "value_type": "string",
                            "default_value": "default",
                            "enum": [
                                { "value": "default", "label": "Light (Default)" },
                                { "value": "prefer-light", "label": "Prefer Light" },
                                { "value": "prefer-dark", "label": "Prefer Dark" }
                            ],
                            "icon": "sun-moon"
                        },
                        {
                            "key": "/org/gnome/desktop/interface/accent-color",
                            "friendly_name": "Accent Colour",
                            "description": "Accent colour used throughout the desktop for highlights and interactive elements.",
                            "value_type": "string",
                            "default_value": "blue",
                            "enum": [
                                { "value": "blue", "label": "Blue" },
                                { "value": "teal", "label": "Teal" },
                                { "value": "green", "label": "Green" },
                                { "value": "yellow", "label": "Yellow" },
                                { "value": "orange", "label": "Orange" },
                                { "value": "red", "label": "Red" },
                                { "value": "pink", "label": "Pink" },
                                { "value": "purple", "label": "Purple" },
                                { "value": "slate", "label": "Slate" }
                            ],
                            "icon": "sparkles"
                        }
                    ]
                },
                {
                    "id": "fonts",
                    "name": "Fonts",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/interface/font-name",
                            "friendly_name": "Interface Font",
                            "description": "Font used for the desktop interface, including menus and labels.",
                            "value_type": "string",
                            "default_value": "Cantarell 11",
                            "enum": null,
                            "icon": "type"
                        },
                        {
                            "key": "/org/gnome/desktop/interface/document-font-name",
                            "friendly_name": "Document Font",
                            "description": "Default font used for documents.",
                            "value_type": "string",
                            "default_value": "Cantarell 11",
                            "enum": null,
                            "icon": "file-text"
                        },
                        {
                            "key": "/org/gnome/desktop/interface/monospace-font-name",
                            "friendly_name": "Monospace Font",
                            "description": "Font used for terminals and code editors.",
                            "value_type": "string",
                            "default_value": "Source Code Pro 10",
                            "enum": null,
                            "icon": "code"
                        },
                        {
                            "key": "/org/gnome/desktop/interface/text-scaling-factor",
                            "friendly_name": "Text Scaling Factor",
                            "description": "Scales all text by this factor. 1.0 is default. Useful for accessibility or high-DPI displays.",
                            "value_type": "double",
                            "default_value": 1.0,
                            "enum": null,
                            "icon": "zoom-in"
                        }
                    ]
                }
            ]
        },
        {
            "id": "interface",
            "icon": "mouse-pointer",
            "name": "Interface & Behaviour",
            "description": "Controls clock display, animations, input behaviour, and desktop interaction",
            "groups": [
                {
                    "id": "clock",
                    "name": "Clock & Date",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/interface/clock-format",
                            "friendly_name": "Clock Format",
                            "description": "Whether the clock uses 12-hour or 24-hour format.",
                            "value_type": "string",
                            "default_value": "24h",
                            "enum": [
                                { "value": "12h", "label": "12-Hour (AM/PM)" },
                                { "value": "24h", "label": "24-Hour" }
                            ],
                            "icon": "clock"
                        },
                        {
                            "key": "/org/gnome/desktop/interface/clock-show-date",
                            "friendly_name": "Show Date in Clock",
                            "description": "Whether to show the date alongside the time in the top bar.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "calendar"
                        },
                        {
                            "key": "/org/gnome/desktop/interface/clock-show-seconds",
                            "friendly_name": "Show Seconds in Clock",
                            "description": "Whether to show seconds in the clock display.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "zap"
                        },
                        {
                            "key": "/org/gnome/desktop/interface/clock-show-weekday",
                            "friendly_name": "Show Weekday in Clock",
                            "description": "Whether to show the day of the week alongside the date.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "calendar-days"
                        }
                    ]
                },
                {
                    "id": "animations",
                    "name": "Animations",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/interface/enable-animations",
                            "friendly_name": "Enable Animations",
                            "description": "Whether to show animations throughout the desktop. Disabling can improve performance on low-end hardware.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "play"
                        }
                    ]
                },
                {
                    "id": "mouse",
                    "name": "Mouse & Touchpad",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/peripherals/mouse/speed",
                            "friendly_name": "Mouse Speed",
                            "description": "Mouse pointer speed from -1.0 (slowest) to 1.0 (fastest).",
                            "value_type": "double",
                            "default_value": 0.0,
                            "enum": null,
                            "icon": "mouse"
                        },
                        {
                            "key": "/org/gnome/desktop/peripherals/mouse/natural-scroll",
                            "friendly_name": "Natural Scrolling (Mouse)",
                            "description": "Whether mouse scrolling direction follows content rather than the traditional direction.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "arrow-down"
                        },
                        {
                            "key": "/org/gnome/desktop/peripherals/mouse/accel-profile",
                            "friendly_name": "Mouse Acceleration Profile",
                            "description": "The pointer acceleration profile applied to mouse movement.",
                            "value_type": "string",
                            "default_value": "default",
                            "enum": [
                                { "value": "default", "label": "Default (Adaptive)" },
                                { "value": "flat", "label": "Flat (No Acceleration)" },
                                { "value": "adaptive", "label": "Adaptive" }
                            ],
                            "icon": "gauge"
                        },
                        {
                            "key": "/org/gnome/desktop/peripherals/touchpad/tap-to-click",
                            "friendly_name": "Tap to Click (Touchpad)",
                            "description": "Whether tapping the touchpad registers as a click.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "mouse-pointer"
                        },
                        {
                            "key": "/org/gnome/desktop/peripherals/touchpad/natural-scroll",
                            "friendly_name": "Natural Scrolling (Touchpad)",
                            "description": "Whether touchpad scrolling direction follows content rather than the traditional direction.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "arrow-down"
                        },
                        {
                            "key": "/org/gnome/desktop/peripherals/touchpad/two-finger-scrolling-enabled",
                            "friendly_name": "Two-Finger Scrolling",
                            "description": "Enable two-finger scrolling on the touchpad.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "hand"
                        },
                        {
                            "key": "/org/gnome/desktop/peripherals/touchpad/disable-while-typing",
                            "friendly_name": "Disable Touchpad While Typing",
                            "description": "Temporarily disables the touchpad while the keyboard is in use to prevent accidental input.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "keyboard"
                        },
                        {
                            "key": "/org/gnome/desktop/peripherals/touchpad/click-method",
                            "friendly_name": "Touchpad Click Method",
                            "description": "How clicks are registered on the touchpad surface.",
                            "value_type": "string",
                            "default_value": "fingers",
                            "enum": [
                                { "value": "default", "label": "Default" },
                                { "value": "none", "label": "Disabled" },
                                { "value": "areas", "label": "Click Areas (Bottom Corners)" },
                                { "value": "fingers", "label": "Finger Count" }
                            ],
                            "icon": "touchpad"
                        }
                    ]
                },
                {
                    "id": "keyboard",
                    "name": "Keyboard",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/peripherals/keyboard/repeat",
                            "friendly_name": "Key Repeat",
                            "description": "Whether keys repeat when held down.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "repeat"
                        },
                        {
                            "key": "/org/gnome/desktop/peripherals/keyboard/repeat-interval",
                            "friendly_name": "Key Repeat Interval (ms)",
                            "description": "Milliseconds between key repeats when a key is held.",
                            "value_type": "uint32",
                            "default_value": 30,
                            "enum": null,
                            "icon": "hourglass"
                        },
                        {
                            "key": "/org/gnome/desktop/peripherals/keyboard/delay",
                            "friendly_name": "Key Repeat Delay (ms)",
                            "description": "Milliseconds before key repeat begins when a key is held.",
                            "value_type": "uint32",
                            "default_value": 500,
                            "enum": null,
                            "icon": "pause"
                        }
                    ]
                }
            ]
        },
        {
            "id": "media_and_removable",
            "icon": "hard-drive",
            "name": "Media & Removable Devices",
            "description": "Controls behaviour when removable media and external devices are connected",
            "groups": [
                {
                    "id": "automount",
                    "name": "Automount",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/media-handling/automount",
                            "friendly_name": "Automount Removable Media",
                            "description": "Whether to automatically mount removable drives when they are connected.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "usb"
                        },
                        {
                            "key": "/org/gnome/desktop/media-handling/automount-open",
                            "friendly_name": "Open File Manager on Mount",
                            "description": "Whether to automatically open the file manager when a drive is mounted.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "folder-open"
                        },
                        {
                            "key": "/org/gnome/desktop/media-handling/autorun-never",
                            "friendly_name": "Disable Autorun",
                            "description": "Disables autorun for all removable media, regardless of per-type settings.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "ban"
                        },
                        {
                            "key": "/org/gnome/desktop/media-handling/autorun-x-content-ignore",
                            "friendly_name": "Ignored Autorun Content Types",
                            "description": "List of content types that should never trigger autorun.",
                            "value_type": "array<string>",
                            "default_value": [],
                            "enum": null,
                            "icon": "list"
                        }
                    ]
                }
            ]
        },
        {
            "id": "network",
            "name": "Network",
            "icon": "network",
            "description": "Controls network-related desktop settings and connectivity notifications",
            "groups": [
                {
                    "id": "wifi",
                    "name": "Wi-Fi",
                    "settings": [
                        {
                            "key": "/org/gnome/nm-applet/disable-wifi-create",
                            "friendly_name": "Disable Wi-Fi Hotspot Creation",
                            "description": "Prevents the user from creating a Wi-Fi hotspot or access point.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "wifi"
                        },
                        {
                            "key": "/org/gnome/nm-applet/suppress-wireless-networks-available",
                            "friendly_name": "Suppress Wi-Fi Available Notifications",
                            "description": "Hides notifications informing the user that wireless networks are available.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "bell-off"
                        }
                    ]
                }
            ]
        },
        {
            "id": "sound",
            "name": "Sound",
            "icon": "volume-2",
            "description": "Controls system audio levels and event sounds",
            "groups": [
                {
                    "id": "volume",
                    "name": "Volume",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/sound/allow-volume-above-100-percent",
                            "friendly_name": "Allow Volume Above 100%",
                            "description": "Whether to allow the output volume to be boosted above 100%.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "volume-2"
                        }
                    ]
                },
                {
                    "id": "event_sounds",
                    "name": "Event Sounds",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/sound/event-sounds",
                            "friendly_name": "Enable Event Sounds",
                            "description": "Whether to play sounds for desktop events such as notifications and errors.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "bell"
                        },
                        {
                            "key": "/org/gnome/desktop/sound/input-feedback-sounds",
                            "friendly_name": "Input Feedback Sounds",
                            "description": "Whether to play sounds for keyboard input events.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "mic"
                        }
                    ]
                }
            ]
        },
        {
            "id": "accessibility",
            "name": "Accessibility",
            "icon": "accessibility",
            "description": "Controls assistive technologies and accessibility features",
            "groups": [
                {
                    "id": "visual",
                    "name": "Visual",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/interface/toolkit-accessibility",
                            "friendly_name": "Enable Accessibility Toolkit",
                            "description": "Enables the accessibility toolkit, required for screen readers and other assistive tools.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "accessibility"
                        },
                        {
                            "key": "/org/gnome/desktop/a11y/applications/screen-magnifier-enabled",
                            "friendly_name": "Screen Magnifier",
                            "description": "Enable the screen magnifier.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "search"
                        },
                        {
                            "key": "/org/gnome/desktop/a11y/applications/screen-reader-enabled",
                            "friendly_name": "Screen Reader",
                            "description": "Enable the screen reader (Orca).",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "ear"
                        },
                        {
                            "key": "/org/gnome/desktop/a11y/interface/high-contrast",
                            "friendly_name": "High Contrast Mode",
                            "description": "Enable high contrast mode for improved visibility.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "contrast"
                        },
                        {
                            "key": "/org/gnome/desktop/a11y/interface/large-text",
                            "friendly_name": "Large Text",
                            "description": "Enable large text mode, increasing the text scaling factor.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "text"
                        }
                    ]
                },
                {
                    "id": "keyboard_a11y",
                    "name": "Keyboard Accessibility",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/a11y/keyboard/enable",
                            "friendly_name": "Enable Keyboard Accessibility",
                            "description": "Master switch for keyboard accessibility features.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "keyboard"
                        },
                        {
                            "key": "/org/gnome/desktop/a11y/keyboard/sticky-keys-enabled",
                            "friendly_name": "Sticky Keys",
                            "description": "Allows modifier keys (Shift, Ctrl, Alt) to remain active after being pressed once.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "key"
                        },
                        {
                            "key": "/org/gnome/desktop/a11y/keyboard/slow-keys-enable",
                            "friendly_name": "Slow Keys",
                            "description": "Requires keys to be held for a set duration before registering, reducing accidental keypresses.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "hourglass"
                        },
                        {
                            "key": "/org/gnome/desktop/a11y/keyboard/bounce-keys-enable",
                            "friendly_name": "Bounce Keys",
                            "description": "Ignores repeated keypresses within a set time window, reducing accidental double presses.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "repeat-2"
                        }
                    ]
                },
                {
                    "id": "mouse_a11y",
                    "name": "Mouse Accessibility",
                    "settings": [
                        {
                            "key": "/org/gnome/desktop/a11y/mouse/secondary-click-enabled",
                            "friendly_name": "Secondary Click (Dwell)",
                            "description": "Trigger a right-click by holding the primary mouse button.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "mouse-pointer-2"
                        },
                        {
                            "key": "/org/gnome/desktop/a11y/mouse/dwell-click-enabled",
                            "friendly_name": "Dwell Click",
                            "description": "Trigger a click automatically after the cursor dwells in one position.",
                            "value_type": "bool",
                            "default_value": false,
                            "enum": null,
                            "icon": "mouse"
                        },
                        {
                            "key": "/org/gnome/desktop/a11y/mouse/dwell-mode",
                            "friendly_name": "Dwell Click Mode",
                            "description": "Whether dwell click acts on the current pointer position or uses a gesture.",
                            "value_type": "string",
                            "default_value": "window",
                            "enum": [
                                { "value": "window", "label": "Use On-Screen Window" },
                                { "value": "gesture", "label": "Use Pointer Gesture" }
                            ],
                            "icon": "move"
                        }
                    ]
                }
            ]
        },
        {
            "id": "updates",
            "icon": "arrow-up-from-line",
            "name": "Software & Updates",
            "description": "Controls automatic update checking, downloading, and notification behaviour",
            "groups": [
                {
                    "id": "gnome_software",
                    "name": "GNOME Software",
                    "settings": [
                        {
                            "key": "/org/gnome/software/allow-updates",
                            "friendly_name": "Allow Updates",
                            "description": "Whether GNOME Software is permitted to update packages.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "check-circle-2"
                        },
                        {
                            "key": "/org/gnome/software/download-updates",
                            "friendly_name": "Download Updates Automatically",
                            "description": "Whether to automatically download available updates in the background.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "download"
                        },
                        {
                            "key": "/org/gnome/software/download-updates-notify",
                            "friendly_name": "Notify About Available Updates",
                            "description": "Whether to notify the user when updates have been downloaded and are ready to install.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "bell"
                        },
                        {
                            "key": "/org/gnome/software/show-ratings",
                            "friendly_name": "Show App Ratings",
                            "description": "Whether to show user ratings and reviews in the software centre.",
                            "value_type": "bool",
                            "default_value": true,
                            "enum": null,
                            "icon": "star"
                        }
                    ]
                }
            ]
        }
    ]
}