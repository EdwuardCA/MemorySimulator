function resetear() {
    document.getElementById("memoriaInput").value = "100, 500, 200, 300, 600";
    document.getElementById("procesosInput").value = "212, 417, 112, 426";
    document.getElementById("memoriaVisual").innerHTML = '<div class="w-full text-center py-20 text-slate-400 italic">Define la memoria y pulsa un algoritmo para iniciar la simulación...</div>';
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

    procesos.forEach((pSize, pIndex) => {
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
            if (elegidoIndex !== -1) {
                razon = `Es el bloque que deja menos residuo (${bloques[elegidoIndex].libre - pSize} KB).`;
            }
        } else if (tipo === 'worst') {
            let peorEspacio = -1;
            bloques.forEach((b, i) => {
                if (b.libre >= pSize && b.libre > peorEspacio) {
                    peorEspacio = b.libre;
                    elegidoIndex = i;
                }
            });
            if (elegidoIndex !== -1) {
                razon = `Es el bloque más grande disponible (${bloques[elegidoIndex].libre} KB).`;
            }
        }

        if (elegidoIndex !== -1) {
            bloques[elegidoIndex].libre -= pSize;
            bloques[elegidoIndex].procesosAsignados.push(pSize);
            logs.push({ pSize, bId: bloques[elegidoIndex].id, success: true, razon });
        } else {
            noAsignados.push(pSize);
            logs.push({ pSize, success: false, razon: "No hay ningún bloque con suficiente espacio continuo." });
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

    algoTag.innerText = tipo.replace('Fit', ' Fit');
    algoTag.classList.remove("hidden");

    bloques.forEach(b => {
        const percLibre = (b.libre / b.size) * 100;
        const percUso = 100 - percLibre;

        const div = document.createElement("div");
        div.className = "memory-block min-w-[140px] flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow";

        div.innerHTML = `
            <div class="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <span class="text-[10px] font-bold text-slate-400 uppercase">ID: ${b.id}</span>
                <span class="text-xs font-bold text-slate-700">${b.size}K</span>
            </div>
            <div class="p-4">
                <div class="relative h-32 bg-slate-100 rounded-xl overflow-hidden flex flex-col-reverse border border-slate-200/50">
                    <div class="bg-blue-500 w-full transition-all duration-1000" style="height: ${percUso}%"></div>
                    ${b.procesosAsignados.map(p => `
                        <div class="absolute w-full border-t border-blue-300/40 pointer-events-none" style="height: ${(p / b.size) * 100}%"></div>
                    `).join('')}
                </div>
                <div class="mt-3 space-y-1">
                    <div class="flex justify-between text-[10px] uppercase font-bold text-slate-400">
                        <span>Libre</span>
                        <span class="${percLibre < 10 ? 'text-red-500' : 'text-emerald-500'}">${b.libre} KB</span>
                    </div>
                    <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-400" style="width: ${percLibre}%"></div>
                    </div>
                </div>
            </div>
        `;
        visual.appendChild(div);
    });

    logs.forEach((log, i) => {
        const item = document.createElement("div");
        item.className = "p-3 rounded-xl border " + (log.success ? "bg-white border-slate-100 shadow-sm" : "bg-red-50 border-red-100 text-red-700");
        item.style.animationDelay = `${i * 0.1}s`;
        item.classList.add("process-enter");

        if (log.success) {
            item.innerHTML = `
                <div class="flex items-start">
                    <div class="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs mr-3 mt-0.5">
                        <i class="fas fa-check"></i>
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-slate-700">Proceso de ${log.pSize} KB → Bloque ${log.bId}</p>
                        <p class="text-xs text-slate-500 mt-1"><b class="text-blue-500">¿Por qué?</b> ${log.razon}</p>
                    </div>
                </div>
            `;
        } else {
            item.innerHTML = `
                <div class="flex items-start">
                    <div class="h-6 w-6 rounded-full bg-red-200 text-red-600 flex items-center justify-center text-xs mr-3 mt-0.5">
                        <i class="fas fa-times"></i>
                    </div>
                    <div>
                        <p class="text-sm font-bold">Proceso de ${log.pSize} KB: RECHAZADO</p>
                        <p class="text-xs opacity-80 mt-1"><b>Error:</b> ${log.razon}</p>
                    </div>
                </div>
            `;
        }
        logContainer.appendChild(item);
    });

    const fragTotal = bloques.reduce((acc, curr) => acc + curr.libre, 0);
    const memTotal = bloques.reduce((acc, curr) => acc + curr.size, 0);
    const eficiencia = ((memTotal - fragTotal) / memTotal) * 100;

    stats.innerHTML = `
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Fragmentación Externa</p>
            <div class="flex items-baseline gap-2">
                <span class="text-2xl font-black text-slate-700">${fragTotal}</span>
                <span class="text-xs text-slate-400 font-bold">KB LIBRES</span>
            </div>
        </div>
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Uso de Memoria</p>
            <div class="flex items-baseline gap-2">
                <span class="text-2xl font-black text-blue-600">${Math.round(eficiencia)}%</span>
                <span class="text-xs text-slate-400 font-bold">OCUPADA</span>
            </div>
        </div>
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">En Espera</p>
            <div class="flex items-baseline gap-2">
                <span class="text-2xl font-black text-red-500">${noAsignados.length}</span>
                <span class="text-xs text-slate-400 font-bold">PROCESOS</span>
            </div>
        </div>
    `;
}

function mostrarMensaje(texto, tipo) {
    const msg = document.createElement("div");
    msg.className = `fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl text-white z-50 transition-all transform translate-y-0 flex items-center ${tipo === 'warning' ? 'bg-orange-500' : 'bg-blue-600'}`;
    msg.innerHTML = `<i class="fas fa-exclamation-triangle mr-3"></i> ${texto}`;
    document.body.appendChild(msg);
    setTimeout(() => {
        msg.style.opacity = "0";
        msg.style.transform = "translateY(20px)";
        setTimeout(() => msg.remove(), 500);
    }, 3000);
}