package com.EtOHCoachFinal;

import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import androidx.annotation.Nullable; // Assuming you're using AndroidX
import android.os.Build;
import android.content.Context;

// import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "EtOHCoachFinal";
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);  // here
    super.onCreate(savedInstanceState);
    android.util.Log.d("EtOHCoach", "MainActivity: onCreate called");
  }
     @Override 
  public Intent registerReceiver(@Nullable BroadcastReceiver receiver , IntentFilter filter) {
    if (Build.VERSION.SDK_INT >= 34 && getApplicationInfo().targetSdkVersion >= 34) {
        return super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
    } else {
        return super.registerReceiver(receiver, filter);
    }
  }

}
