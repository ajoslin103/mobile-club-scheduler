#!/bin/bash

chmod 777 ./app

touch ./app/.restart.FL && chmod 666 ./app/.restart.FL
touch ./app/.restart.SG && chmod 666 ./app/.restart.SG

# I don't think this is ready yet -- ask Dan
# touch ./app/.restart.LAB && chmod 666 ./app/.restart.LAB

