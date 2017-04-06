
/*!
 * @(#) App.java
 * @author Diego Guevara <diegoguevara.github.io>
 * RxNetty Proxy Server
 */

import io.netty.buffer.ByteBuf;
import io.reactivex.netty.protocol.http.server.HttpServer;
import io.reactivex.netty.protocol.http.client.HttpClient;
import io.reactivex.netty.protocol.http.client.HttpClientRequest;
import io.netty.handler.logging.LogLevel;

import java.util.Iterator;
import java.util.Map.Entry;

import java.net.URL;
import java.net.MalformedURLException;

import static rx.Observable.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.activation.*;
import java.io.*;
import java.nio.file.Files;
import com.google.common.net.HttpHeaders;

/**
 * SeguroCanguro Test Application Main Class
 */
public class App {

    private final static Logger logger = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {
        String target_url = "https://segurocanguro.com";
        int target_port = 443;
        int proxy_server_port = 8080;
        
        App.proxyServerStart( proxy_server_port, target_url, target_port, App.logger);
    }

    /**
     * Sets up and starts the RxNetty Proxy Server
     * @param base_url_ SeguroCanguro Api URL
     * @param logger_ Main Applicarion Logger
     */
    private static void proxyServerStart(int proxy_server_port_, String target_url_, int target_port_, Logger logger_) {

        HttpServer<ByteBuf, ByteBuf> server;

        try {
            URL url = new URL(target_url_);

            final HttpClient<ByteBuf, ByteBuf> targetClient = HttpClient.newClient( url.getHost(), target_port_ ).unsafeSecure();

            server = HttpServer.newServer(proxy_server_port_);
            server.enableWireLogging("proxy-server", LogLevel.DEBUG);

            server.start((req, resp) -> {

                // serve api proxy
                if( req.getDecodedPath().indexOf("/api") != -1 ) {

                    HttpClientRequest<ByteBuf, ByteBuf> clientRequest = targetClient.createRequest(req.getHttpMethod(),
                            req.getUri());

                    Iterator<Entry<CharSequence, CharSequence>> serverRequestHeaders = req.headerIterator();
                    while (serverRequestHeaders.hasNext()) {
                        Entry<CharSequence, CharSequence> next = serverRequestHeaders.next();
                        clientRequest = clientRequest.setHeader(next.getKey(), next.getValue());
                    }

                    return clientRequest.writeContent(req.getContent()).flatMap(clientResp -> {
                        Iterator<Entry<CharSequence, CharSequence>> clientRespHeaders = clientResp.headerIterator();

                        while (clientRespHeaders.hasNext()) {
                            Entry<CharSequence, CharSequence> next = clientRespHeaders.next();
                            resp.setHeader(next.getKey(), next.getValue());
                        }

                        resp.setHeader("X-Proxied-By", "RxNetty");

                        return resp.write(clientResp.getContent());
                    });
                }
                else{
                    // serve static content
                    try {
                        String file_path = req.getDecodedPath();
                        if( file_path.equals("/") ) {
                            file_path = "/index.html";
                        }
                        String resource_name = System.getProperty("user.dir") + "/public" + file_path;
                        
                        MimetypesFileTypeMap mimeTypesMap = new MimetypesFileTypeMap();
                        resp.setHeader(HttpHeaders.CONTENT_TYPE, mimeTypesMap.getContentType( resource_name ) );

                        byte[] array = Files.readAllBytes(new File(resource_name).toPath());
                        return resp.writeBytes( just(array) );

                    } catch (IOException e) {
                        App.logger.error(e.getMessage());
                        resp.setHeader(HttpHeaders.CONTENT_TYPE, "text/html" );
                        return resp.writeString( just("File Not Found...") );
                    }
                    
                }
            });

            server.awaitShutdown();

        } catch (MalformedURLException e) {
            logger_.error(e.getMessage());
        }
    }


}
