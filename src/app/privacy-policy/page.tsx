import Footer from "@/components/main/footer";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <section className="relative z-10 max-w-[1000px] mx-auto p-left p-right py-12">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[20px] overflow-hidden">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Política de Privacidad</h1>
            
            <div className="text-white/90 space-y-6 text-sm md:text-base leading-relaxed">
              <p>
                Esta Aplicación recoge algunos Datos Personales de sus Usuarios.
                El presente documento puede imprimirse como referencia utilizando el comando de impresión en las opciones de configuración de cualquier navegador.
              </p>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">Titular y Responsable del tratamiento de los Datos</h2>
                <p>St George School - Baños de Agua Santa - Ecuador</p>
                <p>Correo electrónico de contacto del Titular: stgeorgecentro@gmail.com</p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">Clases de Datos recogidos</h2>
                <p>
                  El Titular no proporciona una lista de categorías de Datos Personales recogidos.
                  La información completa referente a cada categoría de Datos Personales que se recogen se proporciona en las secciones de la presente política de privacidad dedicadas a tal fin o mediante textos explicativos específicos que se muestran antes de la recogida de dichos Datos.
                </p>
                <p className="mt-3">
                  Los Datos Personales podrán ser proporcionados libremente por el Usuario o, en caso de los Datos de Uso, serán recogidos automáticamente cuando se utilice esta Aplicación. Salvo que se indique lo contrario, todos los Datos solicitados por esta Aplicación son obligatorios y la negativa a proporcionarlos podrá imposibilitar que esta Aplicación pueda proceder a la prestación de sus servicios.
                </p>
                <p className="mt-3">
                  El uso de Cookies - o de otras herramientas de seguimiento - por parte de esta Aplicación o por los titulares de servicios de terceros utilizados por esta Aplicación tiene como finalidad la prestación del Servicio solicitado por el Usuario, además de cualesquiera otras finalidades que se describan en el presente documento y en la Política de Cookies.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">Modalidad y lugar del tratamiento de los Datos recogidos</h2>
                
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2 mt-4">Modalidades de Tratamiento</h3>
                <p>
                  El Titular tratará los Datos de los Usuarios de manera adecuada y adoptará las medidas de seguridad apropiadas para impedir el acceso, la revelación, alteración o destrucción no autorizados de los Datos. El tratamiento de Datos se realizará mediante ordenadores y/o herramientas informáticas, siguiendo procedimientos y modalidades organizativas estrictamente relacionadas con las finalidades señaladas.
                </p>

                <h3 className="text-lg md:text-xl font-semibold text-white mb-2 mt-4">Lugar</h3>
                <p>
                  Los Datos se tratan en las oficinas del Titular, así como en cualquier otro lugar en el que se encuentren situadas las partes implicadas en dicho proceso de tratamiento. Dependiendo de la localización de los Usuarios, las transferencias de Datos pueden implicar la transferencia de los Datos de los Usuarios a otro país diferente al suyo propio.
                </p>

                <h3 className="text-lg md:text-xl font-semibold text-white mb-2 mt-4">Período de conservación</h3>
                <p>
                  Salvo que se indique lo contrario en el presente documento, los Datos Personales serán tratados y conservados durante el tiempo necesario y para la finalidad por la que han sido recogidos y podrán conservarse durante más tiempo debido a una obligación legal pertinente o sobre la base del consentimiento de los Usuarios.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">Finalidad del Tratamiento de los Datos recogidos</h2>
                <p>
                  Los Datos relativos al Usuario son recogidos para permitir al Titular prestar su Servicio, cumplir sus obligaciones legales, responder a solicitudes de ejecución, proteger sus derechos e intereses (o los de sus Usuarios o terceros), detectar cualquier actividad maliciosa o fraudulenta, así como para las siguientes finalidades: Registro y autenticación.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">Información detallada del Tratamiento de los Datos Personales</h2>
                <p className="mb-3">Los Datos Personales se recogen para las siguientes finalidades y utilizando los siguientes servicios:</p>
                
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Registro y autenticación</h3>
                <p>
                  Al registrarse o autenticarse, el Usuario permite que esta Aplicación le identifique y le dé acceso a los servicios dedicados. Dependiendo de lo indicado a continuación, los servicios de registro y autenticación podrán ser prestados por la asistencia de terceros.
                </p>
                <p className="mt-3 font-semibold">Google OAuth (Google LLC)</p>
                <p>
                  Google OAuth es un servicio de registro y autenticación prestado por Google LLC y conectado a la red Google.
                  Datos Personales tratados: distintas clases de Datos, según se especifica en la Política de Privacidad del servicio.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">Base jurídica del Tratamiento</h2>
                <p className="mb-3">El Titular podrá tratar los Datos Personales del Usuario, si se cumple una de las siguientes condiciones:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Cuando los Usuarios hayan dado su consentimiento para una o más finalidades específicas.</li>
                  <li>Cuando la obtención de Datos sea necesaria para el cumplimiento de un contrato con el Usuario y/o cualquier otra obligación precontractual del mismo.</li>
                  <li>Cuando el tratamiento sea necesario para el cumplimiento de una obligación legal de obligado cumplimiento por parte del Usuario.</li>
                  <li>Cuando el tratamiento esté relacionado con una tarea ejecutada en interés público o en el ejercicio de competencias oficiales otorgadas al Titular.</li>
                  <li>Cuando el tratamiento sea necesario con el fin de un interés legítimo perseguido por el Titular o un tercero.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">Los derechos de los Usuarios</h2>
                <p className="mb-3">Los Usuarios podrán ejercer ciertos derechos con respecto al tratamiento de Datos por parte del Titular. En particular, los Usuarios tienen derecho a:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Retirar su consentimiento en cualquier momento.</li>
                  <li>Objeción al tratamiento de sus Datos.</li>
                  <li>Acceso a sus Datos.</li>
                  <li>Verificar y solicitar la modificación.</li>
                  <li>Limitar el tratamiento de sus Datos.</li>
                  <li>Borrar o eliminar los Datos Personales.</li>
                  <li>Recibir sus Datos y transferirlos a otro responsable.</li>
                  <li>Poner una reclamación ante la autoridad competente.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">Cómo ejercer estos derechos</h2>
                <p>
                  Cualquier solicitud para ejercer los derechos del Usuario puede dirigirse al Titular a través de los datos de contacto facilitados en el presente documento. Dichas solicitudes son gratuitas y el Titular responderá a ellas tan pronto como le sea posible y siempre dentro del plazo de un mes.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">Modificación de la presente política de privacidad</h2>
                <p>
                  El Titular se reserva el derecho de modificar esta política de privacidad en cualquier momento, notificándolo a los Usuarios a través de esta página. Se recomienda encarecidamente que revisen esta página con frecuencia, tomando como referencia la fecha de la última actualización indicada al final de la página.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

