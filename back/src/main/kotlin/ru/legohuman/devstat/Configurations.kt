package ru.legohuman.devstat

import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.google.common.base.Predicates
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder
import ru.legohuman.devstat.util.CustomizedFormatJavaTimeModule
import springfox.documentation.builders.PathSelectors
import springfox.documentation.builders.RequestHandlerSelectors
import springfox.documentation.spi.DocumentationType
import springfox.documentation.spring.web.plugins.Docket
import springfox.documentation.swagger2.annotations.EnableSwagger2

@Configuration
@EnableSwagger2
open class SwaggerConfig {
    @Value("\${app.api.host}")
    var apiHost: String? = null

    @Bean
    open fun api(): Docket {
        return Docket(DocumentationType.SWAGGER_2)
                .host(apiHost)
                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(Predicates.not(PathSelectors.regex("/error")))
                .build()
    }
}

@Configuration
open class CommonConfiguration {
    @Bean
    open fun jacksonBuilder(): Jackson2ObjectMapperBuilder {
        val b = Jackson2ObjectMapperBuilder()
        b.modules(CustomizedFormatJavaTimeModule(), KotlinModule())
        return b
    }
}