# Add project specific ProGuard rules here.
-keep class com.rajahaider.blueprintgenerator.** { *; }
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
