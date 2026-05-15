(function () {
    async function fileToBase64(file) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();

            reader.onload = function () {
                resolve(reader.result);
            };

            reader.onerror = function () {
                reject(reader.error);
            };

            reader.readAsDataURL(file);
        });
    }

    function createStoragePath(file, folder) {
        const extension = file.name.split(".").pop();
        const safeName = file.name.replace(/[^a-z0-9.-]/gi, "-").toLowerCase();

        return folder + "/" + Date.now() + "-" + safeName + "." + extension;
    }

    async function uploadFile(file, bucket, folder) {
        const supabase = window.supabaseClientService.getSupabaseClient();

        if (!supabase) {
            return fileToBase64(file);
        }

        const path = createStoragePath(file, folder);
        const result = await supabase.storage.from(bucket).upload(path, file, {
            cacheControl: "3600",
            upsert: false
        });

        if (result.error) {
            throw result.error;
        }

        const publicUrlResult = supabase.storage.from(bucket).getPublicUrl(path);

        return publicUrlResult.data.publicUrl;
    }

    async function uploadMany(files, bucket, folder) {
        const uploads = Array.from(files).map(function (file) {
            return uploadFile(file, bucket, folder);
        });

        return Promise.all(uploads);
    }

    window.storageService = {
        fileToBase64: fileToBase64,
        uploadFile: uploadFile,
        uploadMany: uploadMany
    };
})();
