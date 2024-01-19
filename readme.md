### Work flow
---
.
---
---
---
---
---
FLUTTER MOBILE APP
+ Follow TB instruction
    + Download last TB app
    + Get last flutter
    + Get last Android Studio
    + Follow official install guides
+ DO: `flutter run`
    + Build OK
    + Device upload OK
    + ERROR: TB version mismatch
+ DO: Research and try
    
    + Get TB app 1.0.7 to match our 3.5.1 server
    + ERROR: A LOT OF...
+ DO: Install old flutter
    + Acording to TB: 2.12
        + ...But does not apper in flutter releases
    + Try flutter 3.0.0
        + Nearest to allowed SDK: `sdk: ">=2.12.0 <3.0.0"` pubspec.yaml
        + Minimice API specification errors
+ TRY:
    + Use 2 flutter versions
    + create .bat files
    + add .bat files parent folder to the path
    +   `echo off       C:\mobileDev\flutter\bin\flutter %*`
    + ERROR: flutter error: cannot find symbol (!isTrustedWebActivity ? ChromeCustomTabsActivitySingleInstance.class : TrustedWebActivitySingleInstance.class));

+ ALL artifacts versions must match
+ Install and import morgan

+ ERROR: flutter doctor : Unable to find bundled Java version.
    + For some reason th SDK look for the 'jre' folder, but now its name is 'jbr'
    + Create a symbolic link to redirect the paths
    + In cmd: `mklink /D "jre" "jbr" `
    + ERROR: Execution failed for task ':app:compileFlutterBuildDebug' + 'java.lang.StackOverflowError (no error message)'.
+ TRY: Downgrade gradle
    + Bad try
    + Learn gradle
    + ERROR: FAILURE: Build failed with an exception. * What went wrong: A problem occurred configuring root project 'android'. > Could not resolve all files for configuration ':classpath'. > Could not find com.android.tools.build:gradle:
    + Leave same hardcoded original gradle version
+ TRY: `flutter clean`
    + OK
    + ERROR: error: cannot find symbol private ThreadedInputConnectionProxyAdapterView proxyAdapterView; ^ symbol: class ThreadedInputConnectionProxyAdapterView location: class InputAwareWebView
    + ERROR: Building with plugins requires symlink support. Please enable Developer Mode in your system    settings. Run `start ms-settings:developers`
+ TRY: run the command `start ms-settings:developers`
    + Opens windows configs
    + Toggle developer mode ON
+ ERROR: lib/core/auth/login/login_page.dart:29:7: Error: No named parameter with the name 'foregroundColor'.
    + Change property name: `primary: Colors.black87`