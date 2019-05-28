# Backend для тестового задания ИАЦ МЧС России.

library(leaflet)
library(htmlwidgets)
library(shiny)

ui <- list(
  fluidPage(
    title = 'Инфографика погоды',
    leafletOutput(outputId = 'map', width = '100%', height = '100%'),
    absolutePanel(
      id = 'widgets', draggable = F, fixed = T,
      actionButton(inputId = 'getData', label = 'Отобразить термоточки', class = 'btn-block'),
      actionButton(inputId = 'clearMap', label = 'Очистить карту', class = 'btn-block')
    )
  ),
  singleton(list(tags$head(
    tags$link(rel = "stylesheet", href = "style.css", type = "text/css"),
    tags$script(src = "script.js", type = "text/javascript")
  )))
)

server <- function(input, output, session)
{
  output$map <- renderLeaflet({
    leaflet() %>%
      setView(lng = 100, lat = 66, zoom = 3) %>%
      addProviderTiles(provider = providers$OpenStreetMap) %>%
      addScaleBar(
        position = "bottomleft",
        options = scaleBarOptions(
          maxWidth = 100,
          metric = TRUE,
          imperial = FALSE,
          updateWhenIdle = FALSE
        )
      ) %>%
      addEasyButton(
        easyButton(
          icon = "fa-crosshairs",
          onClick = JS("mapCentering"),
          title = "Центрировать карту на запрошенной области"
        )
      ) %>%
      onRender("function(el, x) {
								mymapInit(this);
								}")
  })

  observeEvent(input$getData, {
    f <- 'www/data/iac_07aug-13aug_2017_comma.csv'
    msg <- list(status = 'OK', data = NA)
    if (file.exists(f))
      msg$data <- read.csv(f)
    else
      msg$status <- 'ERROR'
    session$sendCustomMessage('eData', msg)
  })
	
	observeEvent(input$clearMap, {
		session$sendCustomMessage('clearMap', '')
	})
}

shinyApp(ui = ui, server = server)