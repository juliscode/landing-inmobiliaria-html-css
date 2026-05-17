(function () {
    const STORAGE_PROPIEDADES = "propiedadesAdmin";
    const STORAGE_OVERRIDES = "propiedadesBaseOverrides";
    const SUPABASE_TIMEOUT_MS = 7000;

    function withTimeout(promise) {
        return Promise.race([
            promise,
            new Promise(function (_, reject) {
                setTimeout(function () {
                    reject(new Error("Supabase tardó demasiado en responder."));
                }, SUPABASE_TIMEOUT_MS);
            })
        ]);
    }

    function crearIdBase(index) {
        return "base-" + index;
    }

    function leerJsonLocalStorage(clave, fallback) {
        try {
            return JSON.parse(localStorage.getItem(clave)) || fallback;
        } catch (error) {
            console.warn("No se pudo leer " + clave + " desde localStorage:", error.message);
            return fallback;
        }
    }

    function normalizeImages(images) {
        if (Array.isArray(images)) {
            return images.filter(function (image) {
                return typeof image === "string" && image.trim() !== "";
            });
        }

        if (typeof images === "string" && images.trim() !== "") {
            return images
                .split("\n")
                .map(function (image) {
                    return image.trim();
                })
                .filter(function (image) {
                    return image !== "";
                });
        }

        return [];
    }

    function normalizeLocalProperty(propiedad, index) {
        return {
            id: propiedad.id || crearIdBase(index),
            titulo: propiedad.titulo || "",
            precio: propiedad.precio || "",
            ubicacion: propiedad.ubicacion || "",
            metros: propiedad.metros || "",
            tipo: propiedad.tipo || "Venta",
            whatsapp: propiedad.whatsapp || "",
            imagenes: normalizeImages(propiedad.imagenes),
            video: propiedad.video || "",
            destacada: propiedad.destacada !== false,
            created_at: propiedad.created_at || null,
            updated_at: propiedad.updated_at || null,
            origen: propiedad.origen || "base"
        };
    }

    function fromSupabase(row) {
        return {
            id: row.id,
            titulo: row.title || row.titulo || "",
            precio: row.price || row.precio || "",
            ubicacion: row.location || row.ubicacion || "",
            metros: row.square_meters || row.metros || "",
            tipo: row.operation_type || row.tipo || "Venta",
            whatsapp: row.whatsapp_url || row.whatsapp || "",
            imagenes: normalizeImages(row.images || row.imagenes),
            video: row.video_url || row.video || "",
            destacada: row.is_featured,
            created_at: row.created_at,
            updated_at: row.updated_at,
            origen: "supabase"
        };
    }

    function toSupabase(propiedad) {
        return {
            title: propiedad.titulo,
            price: propiedad.precio,
            location: propiedad.ubicacion,
            square_meters: propiedad.metros,
            operation_type: propiedad.tipo,
            whatsapp_url: propiedad.whatsapp,
            images: propiedad.imagenes,
            video_url: propiedad.video || null,
            is_featured: propiedad.destacada !== false
        };
    }

    function obtenerOverridesBase() {
        return leerJsonLocalStorage(STORAGE_OVERRIDES, {});
    }

    function guardarOverridesBase(overrides) {
        localStorage.setItem(STORAGE_OVERRIDES, JSON.stringify(overrides));
    }

    function obtenerPropiedadesAdminLocal() {
        return leerJsonLocalStorage(STORAGE_PROPIEDADES, []).map(function (propiedad, index) {
            return normalizeLocalProperty(Object.assign({}, propiedad, {
                origen: propiedad.origen || "admin"
            }), index);
        });
    }

    function guardarPropiedadesAdminLocal(propiedadesAdmin) {
        localStorage.setItem(STORAGE_PROPIEDADES, JSON.stringify(propiedadesAdmin));
    }

    function obtenerPropiedadesBaseLocal() {
        const overrides = obtenerOverridesBase();

        return (window.propiedades || []).map(function (propiedad, index) {
            const id = crearIdBase(index);
            const propiedadBase = normalizeLocalProperty(Object.assign({}, propiedad, {
                id: id,
                origen: "base"
            }), index);

            if (overrides[id]) {
                return normalizeLocalProperty(Object.assign({}, propiedadBase, overrides[id], {
                    id: id,
                    origen: "base"
                }), index);
            }

            return propiedadBase;
        });
    }

    function listLocal() {
        return obtenerPropiedadesBaseLocal().concat(obtenerPropiedadesAdminLocal());
    }

    async function listProperties() {
        const supabase = window.supabaseClientService.getSupabaseClient();

        if (!supabase) {
            console.info("Supabase no configurado. Usando propiedades locales.");
            return listLocal();
        }

        let result;

        try {
            result = await withTimeout(
                supabase
                    .from("properties")
                    .select("*")
                    .order("created_at", { ascending: false })
            );
        } catch (error) {
            console.warn("Supabase properties fallback: la consulta falló. Usando propiedades locales.", error.message);
            return listLocal();
        }

        if (result.error) {
            console.warn("Supabase properties fallback: Supabase devolvió error. Usando propiedades locales.", result.error.message);
            return listLocal();
        }

        if (!result.data || result.data.length === 0) {
            console.warn("Supabase properties fallback: la tabla properties está vacía. Usando propiedades locales.");
            return listLocal();
        }

        const propiedadesSupabase = result.data.map(fromSupabase);

        if (propiedadesSupabase.length === 0) {
            console.warn("Supabase properties fallback: no se pudieron normalizar propiedades. Usando propiedades locales.");
            return listLocal();
        }

        console.info("Propiedades cargadas desde Supabase:", propiedadesSupabase.length);
        return propiedadesSupabase;
    }

    async function saveProperty(propiedad, context) {
        const supabase = window.supabaseClientService.getSupabaseClient();

        if (supabase && propiedad.origen !== "base") {
            if (propiedad.id && propiedad.origen === "supabase") {
                const result = await supabase
                    .from("properties")
                    .update(toSupabase(propiedad))
                    .eq("id", propiedad.id)
                    .select()
                    .single();

                if (result.error) {
                    throw result.error;
                }

                return fromSupabase(result.data);
            }

            const result = await supabase
                .from("properties")
                .insert(toSupabase(propiedad))
                .select()
                .single();

            if (result.error) {
                throw result.error;
            }

            return fromSupabase(result.data);
        }

        if (context && context.origen === "base") {
            const overrides = obtenerOverridesBase();
            overrides[context.id] = Object.assign({}, propiedad, {
                id: context.id,
                origen: "base"
            });
            guardarOverridesBase(overrides);

            return overrides[context.id];
        }

        const adminProperties = obtenerPropiedadesAdminLocal();

        if (context && context.id) {
            const updatedProperties = adminProperties.map(function (item) {
                if (String(item.id) === String(context.id)) {
                    return Object.assign({}, propiedad, {
                        id: context.id,
                        origen: "admin"
                    });
                }

                return item;
            });
            guardarPropiedadesAdminLocal(updatedProperties);
            return propiedad;
        }

        const nuevaPropiedad = Object.assign({}, propiedad, {
            id: Date.now(),
            origen: "admin",
            created_at: new Date().toISOString()
        });
        adminProperties.push(nuevaPropiedad);
        guardarPropiedadesAdminLocal(adminProperties);

        return nuevaPropiedad;
    }

    async function deleteProperty(propiedad) {
        const supabase = window.supabaseClientService.getSupabaseClient();

        if (supabase && propiedad.origen === "supabase") {
            const result = await supabase.from("properties").delete().eq("id", propiedad.id);

            if (result.error) {
                throw result.error;
            }

            return;
        }

        if (propiedad.origen === "base") {
            const overrides = obtenerOverridesBase();
            delete overrides[propiedad.id];
            guardarOverridesBase(overrides);
            return;
        }

        const adminProperties = obtenerPropiedadesAdminLocal().filter(function (item) {
            return String(item.id) !== String(propiedad.id);
        });
        guardarPropiedadesAdminLocal(adminProperties);
    }

    async function migrateBasePropertiesToSupabase() {
        const supabase = window.supabaseClientService.getSupabaseClient();

        if (!supabase) {
            throw new Error("Configurá Supabase antes de migrar propiedades.");
        }

        const current = await supabase.from("properties").select("title, location");

        if (current.error) {
            throw current.error;
        }

        const existingKeys = current.data.map(function (row) {
            return row.title + "|" + row.location;
        });

        const baseProperties = obtenerPropiedadesBaseLocal().filter(function (propiedad) {
            return !existingKeys.includes(propiedad.titulo + "|" + propiedad.ubicacion);
        });

        if (baseProperties.length === 0) {
            return 0;
        }

        const rows = baseProperties.map(toSupabase);
        const result = await supabase.from("properties").insert(rows);

        if (result.error) {
            throw result.error;
        }

        return baseProperties.length;
    }

    window.propertiesService = {
        listProperties: listProperties,
        saveProperty: saveProperty,
        deleteProperty: deleteProperty,
        migrateBasePropertiesToSupabase: migrateBasePropertiesToSupabase,
        listLocal: listLocal,
        fromSupabase: fromSupabase,
        toSupabase: toSupabase
    };
})();
