package ru.legohuman.devstat.controller

import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.Mockito.validateMockitoUsage
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext

@RunWith(SpringRunner::class)
@SpringBootTest
open class ControllerTests {
    val jsonContentType = "application/json;charset=UTF-8"

    @Autowired
    private lateinit var webApplicationContext: WebApplicationContext
    @Autowired
    protected lateinit var mapper: ObjectMapper

    protected lateinit var mockMvc: MockMvc

    @Before
    fun setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build()
    }

    @After
    fun validate() {
        validateMockitoUsage()
    }

    @Test
    fun contextLoads() {
    }
}