(function () {
    const STORAGE_PROPIEDADES = "propiedadesAdmin";
    const STORAGE_OVERRIDES = "propiedadesBaseOverrides";
    const SUPABASE_TIMEOUT_MS = 7000;

    function logger() {
        return window.loggerService || {
            info: function () {},
            warn: function () {},
            error: function () {},
            getUserMessage: function (error, fallback) {
                return fallback || error.message;
            }
        };
    }

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
            logger().warn("No se pudo leer datos locales de propiedades.", error);
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

    function normalizeOptionalNumber(value) {
        const numberValue = Number(value);

        if (value === null || value === undefined || value === "" || Number.isNaN(numberValue)) {
            return null;
        }

        return numberValue;
    }

    function sortProperties(propiedades) {
        return propiedades.slice().sort(function (a, b) {
            const ordenA = normalizeOptionalNumber(a.orden) || 0;
            const ordenB = normalizeOptionalNumber(b.orden) || 0;

            if (ordenA !== ordenB) {
                return ordenA - ordenB;
            }

            return String(b.created_at || "").localeCompare(String(a.created_at || ""));
        });
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
            dormitorios: normalizeOptionalNumber(propiedad.dormitorios),
            banos: normalizeOptionalNumber(propiedad.banos),
            cochera: propiedad.cochera === true,
            barrio: propiedad.barrio || "",
            estado: propiedad.estado || "publicada",
            destacada: propiedad.destacada !== false,
            orden: normalizeOptionalNumber(propiedad.orden) || 0,
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
            dormitorios: normalizeOptionalNumber(row.bedrooms !== undefined ? row.bedrooms : row.dormitorios),
            banos: normalizeOptionalNumber(row.bathrooms !== undefined ? row.bathrooms : row.banos),
            cochera: row.garage === true || row.cochera === true,
            barrio: row.neighborhood || row.barrio || "",
            estado: row.status || row.estado || "publicada",
            destacada: row.is_featured,
            orden: normalizeOptionalNumber(row.display_order !== undefined ? row.display_order : row.orden) || 0,
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
            is_featured: propiedad.destacada !== false,
            bedrooms: normalizeOptionalNumber(propiedad.dormitorios),
            bathrooms: normalizeOptionalNumber(propiedad.banos),
            garage: propiedad.cochera === true,
            neighborhood: propiedad.barrio || null,
            status: propiedad.estado || "publicada",
            display_order: normalizeOptionalNumber(propiedad.orden) || 0
        };
    }

    async function requireAdminPermission() {
        if (!window.authService || !window.authService.isAdmin) {
            throw new Error("No se pudo verificar el permiso de administrador.");
        }

        const admin = await window.authService.isAdmin();

        if (!admin) {
            throw new Error("Tu usuario no tiene permisos de administrador.");
        }
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
        return sortProperties(obtenerPropiedadesBaseLocal().concat(obtenerPropiedadesAdminLocal()));
    }

    async function listProperties() {
        const supabase = window.supabaseClientService.getSupabaseClient();

        if (!supabase) {
            logger().info("Supabase no configurado. Usando propiedades locales.");
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
            logger().warn("La consulta de propiedades falló. Usando fallback local.", error);
            return listLocal();
        }

        if (result.error) {
            logger().warn("Supabase devolvió error al listar propiedades. Usando fallback local.", result.error);
            return listLocal();
        }

        if (!result.data || result.data.length === 0) {
            logger().warn("La tabla properties está vacía. Usando fallback local.");
            return listLocal();
        }

        const propiedadesSupabase = result.data.map(fromSupabase);

        if (propiedadesSupabase.length === 0) {
            logger().warn("No se pudieron normalizar propiedades. Usando fallback local.");
            return listLocal();
        }

        logger().info("Propiedades cargadas desde Supabase.");
        return sortProperties(propiedadesSupabase);
    }

    async function saveProperty(propiedad, context) {
        await requireAdminPermission();

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
        await requireAdminPermission();

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
        await requireAdminPermission();

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
