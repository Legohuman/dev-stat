#!/bin/bash

exec java -jar /opt/dev-stat/dev-stat.jar -Xmx512m -Xms512m -server -XX:+UseG1GC -XX:MaxGCPauseMillis=20 -XX:InitiatingHeapOccupancyPercent=35 -XX:+DisableExplicitGC -Djava.awt.headless=true -Xloggc:/var/log/dev-stat.gc.log \
ru.legohuman.devstat.DevStatApplication
