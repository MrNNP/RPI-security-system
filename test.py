from datetime import time
from time import sleep
data = ''
input = input('input to write: ')
zone = 1
with open('data.txt','r') as a:
    datatowrite = str(zone)+' is '+str(input)
    print(datatowrite)
    data = a.read()
    data = data.replace(str(zone)+' is 0',datatowrite)
    data = data.replace(str(zone)+' is 1',datatowrite)
with open('data.txt','w') as b:
    b.write(data)