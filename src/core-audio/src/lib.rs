use cpal::traits::{DeviceTrait, HostTrait};

pub fn list_output_devices() -> Vec<String> {
    let host = cpal::default_host();
    host.output_devices()
        .map(|devices| devices.filter_map(|d| d.name().ok()).collect())
        .unwrap_or_default()
}

#[no_mangle]
pub extern "C" fn core_audio_version() -> *const u8 {
    b"0.1.0\0".as_ptr()
}
