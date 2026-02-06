function resetear() {
    document.getElementById("memoriaInput").value = "100, 500, 200, 300, 600";
    document.getElementById("procesosInput").value = "212, 417, 112, 426";
    document.getElementById("memoriaVisual").innerHTML = '<div class="w-full text-center py-20 text-slate-400 italic">Define la memoria e inicia la simulación...</div>';
    document.getElementById("statsContainer").classList.add("hidden");
    document.getElementById("processLog").innerHTML = "";
    document.getElementById("algoTag").classList.add("hidden");
}

function simular(tipo) {
    const memRaw = document.getElementById("memoriaInput").value;
    const procRaw = document.getElementById("procesosInput").value;

    if (!memRaw || !procRaw) {
        mostrarMensaje("Ingresa valores de memoria y procesos.", "warning");
        return;
    }

    const memoria = memRaw.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const procesos = procRaw.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

    let bloques = memoria.map((size, index) => ({
        id: index + 1,
        size,
        libre: size,
        procesosAsignados: []
    }));

    let logs = [];
    let noAsignados = [];

    procesos.forEach((pSize) => {
        let elegidoIndex = -1;
        let razon = "";

        if (tipo === 'first') {
            for (let i = 0; i < bloques.length; i++) {
                if (bloques[i].libre >= pSize) {
                    elegidoIndex = i;
                    razon = `Es el primer bloque donde caben ${pSize} KB.`;
                    break;
                }
            }
        } else if (tipo === 'best') {
            let mejorEspacio = Infinity;
            bloques.forEach((b, i) => {
                if (b.libre >= pSize && b.libre < mejorEspacio) {
                    mejorEspacio = b.libre;
                    elegidoIndex = i;
                }
            });
            if (elegidoIndex !== -1) razon = `Mínimo residuo (${bloques[elegidoIndex].libre - pSize} KB).`;
        } else if (tipo === 'worst') {
            let peorEspacio = -1;
            bloques.forEach((b, i) => {
                if (b.libre >= pSize && b.libre > peorEspacio) {
                    peorEspacio = b.libre;
                    elegidoIndex = i;
                }
            });
            if (elegidoIndex !== -1) razon = `Bloque más grande (${bloques[elegidoIndex].libre} KB).`;
        }

        if (elegidoIndex !== -1) {
            bloques[elegidoIndex].libre -= pSize;
            bloques[elegidoIndex].procesosAsignados.push(pSize);
            logs.push({ pSize, bId: bloques[elegidoIndex].id, success: true, razon });
        } else {
            noAsignados.push(pSize);
            logs.push({ pSize, success: false, razon: "Sin espacio suficiente." });
        }
    });

    renderizar(bloques, logs, noAsignados, tipo);
}

function renderizar(bloques, logs, noAsignados, tipo) {
    const visual = document.getElementById("memoriaVisual");
    const logContainer = document.getElementById("processLog");
    const stats = document.getElementById("statsContainer");
    const algoTag = document.getElementById("algoTag");

    visual.innerHTML = "";
    logContainer.innerHTML = "";
    stats.classList.remove("hidden");
    algoTag.innerText = tipo.toUpperCase() + " FIT";
    algoTag.classList.remove("hidden");

    bloques.forEach(b => {
        const percLibre = (b.libre / b.size) * 100;
        const percUso = 100 - percLibre;
        const div = document.createElement("div");
        div.className = "memory-block min-w-[140px] flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm";
        div.innerHTML = `
            <div class="p-3 bg-slate-50 border-b border-slate-100 flex justify-between">
                <span class="text-[10px] font-bold text-slate-400">ID: ${b.id}</span>
                <span class="text-xs font-bold">${b.size}K</span>
            </div>
            <div class="p-4">
                <div class="relative h-32 bg-slate-100 rounded-xl overflow-hidden flex flex-col-reverse">
                    <div class="bg-blue-500 w-full transition-all duration-1000" style="height: ${percUso}%"></div>
                </div>
                <div class="mt-3 text-[10px] uppercase font-bold text-slate-400">
                    Libre: <span class="text-emerald-500">${b.libre} KB</span>
                </div>
            </div>`;
        visual.appendChild(div);
    });

    logs.forEach((log, i) => {
        const item = document.createElement("div");
        item.className = `p-3 rounded-xl border process-enter ${log.success ? 'bg-white border-slate-100' : 'bg-red-50 border-red-100 text-red-700'}`;
        item.style.animationDelay = `${i * 0.1}s`;
        item.innerHTML = `<p class="text-sm font-semibold">${log.success ? 'Proceso ' + log.pSize + 'K → B' + log.bId : 'Rechazado ' + log.pSize + 'K'}</p>
                          <p class="text-xs text-slate-500">${log.razon}</p>`;
        logContainer.appendChild(item);
    });

    stats.innerHTML = `<div class="p-4 bg-slate-50 rounded-2xl">Fragmentación: ${bloques.reduce((a, c) => a + c.libre, 0)} KB</div>`;
}

function mostrarMensaje(t, tipo) {
    alert(t); // Simplificado para el ejemplo
}