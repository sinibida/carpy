// Prevents additional console window on Windows in release, DO NOT REMOVE!! 
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{utils::config::AppUrl, Manager, WindowUrl};

// Tauri by default uses HTTPS, so use the localhost plugin to downgrade back to
// HTTP. However, when running tauri dev, we already have a localhost server
// provided by vite, so don't enable it
#[cfg(dev)]
const IS_DEV: bool = true;
#[cfg(not(dev))]
const IS_DEV: bool = false;

const USE_LOCALHOST_SERVER: bool = !IS_DEV;

fn main() {
    let port = portpicker::pick_unused_port().expect("failed to find unused port");

    let window_url = if USE_LOCALHOST_SERVER {
        WindowUrl::External(format!("http://localhost:{}", port).parse().unwrap())
    } else {
        WindowUrl::App("".into())
    };

    let mut context = tauri::generate_context!();
    let mut builder = tauri::Builder::default();

    if USE_LOCALHOST_SERVER {
        context.config_mut().build.dist_dir = AppUrl::Url(window_url.clone());
        builder = builder.plugin(tauri_plugin_localhost::Builder::new(port).build())
    }

    builder
        .setup(move |app| {
            // https://github.com/tauri-apps/tauri/discussions/5377
            let main_window = app.get_window("main").unwrap();
            if IS_DEV {
                main_window.set_title(
                    &format!("{} (DEV)", main_window.title().expect("failed getting title"))
                ).expect("failed setting title");
            }
            main_window.eval(&format!("window.location.replace('{}')", window_url.clone().to_string())).expect("Eval Failed");
            Ok(())
        })
        .run(context)
        .expect("failed to run app");
}