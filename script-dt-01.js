function appendDatadogScript() {
    let datadogScript = document.createElement("script");
    datadogScript.innerHTML = `
    (function(h,o,u,n,d) {
      h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
      d=o.createElement(u);d.async=1;d.src=n
      n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
    })(window,document,'script','https://www.datadoghq-browser-agent.com/us1/v4/datadog-rum.js','DD_RUM')
    window.DD_RUM.onReady(function() {
      window.DD_RUM.init({
        clientToken: 'pub380658ae527e3df6d78c22135445360d',
        applicationId: '67aae31c-4dbe-4e13-96cf-d9d35b9f1dab',
        site: 'datadoghq.com',
        service: 'tiendanube-checkout-frontend',
        env: '<ENV_NAME>',
        // Specify a version number to identify the deployed version of your application in Datadog 
        // version: '1.0.0', 
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask-user-input',
      });
  
      window.DD_RUM.startSessionReplayRecording();
    })
    `;
    document.head.insertAdjacentElement("afterbegin", datadogScript);
  }

appendDatadogScript()
