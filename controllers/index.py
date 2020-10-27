import RPi.GPIO as GPIO
#from EmulatorGUI import GPIO
from datetime import time
from time import sleep
import sys
temp = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
zones = [7,8,10,12]

GPIO.setmode(GPIO.BOARD)
GPIO.setup(zones, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
while True:

    sleep(0.03)
    for zone in zones:
        
        if(temp[zones.index(zone)] == GPIO.input(zone)):
            continue
        else:
             temp[zones.index(zone)] = GPIO.input(zone)
            
             if(GPIO.input(zone)):
                 sleep(0.7)
                 if(GPIO.input(zone)):
                     print(str(zones.index(zone))+'1')
                     sys.stdout.flush()
                     
                 
             else:
                print(str(zones.index(zone))+'0')
                sys.stdout.flush()


GPIO.cleanup()
