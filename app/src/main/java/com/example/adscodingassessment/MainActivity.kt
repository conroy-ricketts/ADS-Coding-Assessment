package com.example.adscodingassessment

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.compose.ui.viewinterop.AndroidView
import androidx.webkit.WebViewAssetLoader
import com.example.adscodingassessment.ui.theme.ADSCodingAssessmentTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Stretch the app to fill the entire screen.
        enableEdgeToEdge()

        setContent {
            ADSCodingAssessmentTheme {
                // This WebView will contain the majority of the app's content.
                WebView()
            }
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun WebView() {
    AndroidView(factory = { context ->
        // Create an instance of WebViewAssetLoader.
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(context))
            .addPathHandler("/res/", WebViewAssetLoader.ResourcesPathHandler(context))
            .build()

        WebView(context).apply {
            settings.javaScriptEnabled = true
            settings.allowFileAccess = true
            settings.domStorageEnabled = true

            // Intercept requests and use the instance of WebViewAssetLoader.
            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest
                ): WebResourceResponse? {
                    return assetLoader.shouldInterceptRequest(request.url)
                }
            }

            // Set up a download listener for when the user tries to export the contacts.
            setDownloadListener { _, _, _, _, _ ->
                Toast.makeText(
                    context,
                    "Use this app from a web browser to export contacts.",
                    Toast.LENGTH_SHORT
                ).show()
            }

            // Load the initial URL using the same https scheme as the WebViewAssetLoader.
            // Note that "appassets.androidplatform.net" is a conventional placeholder.
            loadUrl("https://appassets.androidplatform.net/assets/webapp/index.html")
        }
    })
}