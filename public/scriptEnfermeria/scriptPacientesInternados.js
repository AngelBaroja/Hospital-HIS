document.addEventListener('DOMContentLoaded', function() {
                document.querySelectorAll('.tarjeta-paciente').forEach(function(card) {
                    card.addEventListener('click', function() {
                        document.querySelectorAll('.tarjeta-paciente').forEach(c => c.classList.remove('seleccionada'));
                        this.classList.add('seleccionada');
                    });
                    card.addEventListener('dblclick', function() {
                        const recepcionId = this.getAttribute('data-recepcion-id');
                        window.location.href = `/enfermeria/elegir/${recepcionId}`;
                    });
                });
            });