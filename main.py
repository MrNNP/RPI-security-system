from datetime import time
from time import sleep
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import RPi.GPIO as GPIO
armed = [1,0]
sender_email = input('email to send from:  ')
receiver_email = input('email to send to: ')
password = input('password pls: ')
def pintozone(pin,temp=0):
    for zone in zones:
        if(zones[temp]==pin):
            
            break
        else:
            temp+=1
    return temp
def makesummary():
    summary = ''
    for zone in zones:
        if(GPIO.input(zone)):
            summary+='<b>Zone '+zone+' is active</b><br>'
        else:
            summary+='Zone '+zone+' is not active <br>'
    return summary
def setarmedstate(arm = 1,away = 0):
    
    message = MIMEMultipart("alternative")
    if(arm and armed[0]!=arm):
        message["Subject"] = "ALERT!!!!! SYSTEM STATE HAS JUST BEEN SET TO ARMED"
        text = """\
        ALERT! Your system has been armed,

        You will be emailed for all zone detections until system is disarmed.
        """
        html = """\
        <html>
        <body>
        <p>ALERT! System staus has been set to ARMED,<br>
       
        You will be emailed for all zone detections.<br>
        <a href="about:blank">This link will become functional in the future</a><br> 
       ^^Click the link above to take futher action^^<br>
       Summary of zones:<br>

        </p>
        </body>
        </html>
        """
    elif(not arm and armed[0]!=arm):
        message["Subject"] = "ALERT!!!!! SYSTEM STATE HAS JUST BEEN SET TO DISARMED"
        text = """\
        ALERT! Your system has been disarmed,

        You will be NOT emailed for all zone detections until system is disarmed.
        """
        html = """\
        <html>
        <body>
        <p>ALERT! System staus has been set to DISARMED,<br>
       
        You will be NOT emailed for all zone detections.<br>
        <a href="about:blank">This link will become functional in the future</a><br> 
       ^^Click the link above to take futher action^^<br>
        Summary of zones:<br>"""+makesummary()+"""
        </p>
        </body>
        </html>
        """
    armed[0] = arm
    armed[1] = away
 
    

    
    
    message["From"] = sender_email
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message
    
    

    # Turn these into plain/html MIMEText objects
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    # Add HTML/plain-text parts to MIMEMultipart message
    # The email client will try to render the last part first
    message.attach(part1)   
    message.attach(part2)

    # Create secure connection with server and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
       server.login(sender_email, password)
       server.sendmail(
       sender_email, receiver_email, message.as_string()
    )
def readarmfile():
    fs = open('data.txt','r')
    setarmedstate(fs.readline(0))    
    fs.close()
def writestate(zonee,input=1):
    data = ''
    input = GPIO.input(zonee)
    zonee = pintozone(zonee)
    with open('data.txt','r') as a:
        datatowrite = str(zonee)+' is '+str(input)
        print(datatowrite)
        data = a.read()
        data = data.replace('Zone '+str(zonee)+' is 0',datatowrite)
        data = data.replace('Zone '+str(zonee)+' is 1',datatowrite)
    with open('data.txt','w') as b:
        b.write(data)
def emailzone(zone):
    zone = str(zone)
   
    

    message = MIMEMultipart("alternative")
    message["Subject"] = "ALERT!!!!! ZONE "+zone+" HAS JUST BEEN TRIGGERED"
    message["From"] = sender_email
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message
    text = """\
    ALERT! ZONE """+zone+""" HAS BEEN TRIGGERED,

    Zone number """+zone+""" has just been triggered.
    """
    html = """\
    <html>
  <body>
    <p>ALERT! ZONE """+zone+""" HAS BEEN TRIGGERED,<br>
       
    Zone number """+zone+""" has just been triggered.<br>
       <a href="about:blank">This link will become functional in the future</a><br> 
       ^^Click the link above to take futher action^^<br>
       Summary of zones:<br>"""+makesummary()+"""

    </p>
    </body>
    </html>
    """

    # Turn these into plain/html MIMEText objects
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    # Add HTML/plain-text parts to MIMEMultipart message
    # The email client will try to render the last part first
    message.attach(part1)   
    message.attach(part2)

    # Create secure connection with server and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
       server.login(sender_email, password)
       server.sendmail(
       sender_email, receiver_email, message.as_string()
    )

zones = [7,8,10,12]
GPIO.setmode(GPIO.BOARD)
GPIO.setup(zones, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
print('test')
temp = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
while True:
    readarmfile()
    sleep(0.03)
    for zone in zones:
        
        if(temp[pintozone(zone)] == GPIO.input(zone)):
            continue
        else:
             temp[pintozone(zone)] = GPIO.input(zone)
             writestate(zone)
             if(GPIO.input(zone)):
                 sleep(0.7)
                 if(GPIO.input(zone)):
                     print('Zone '+str(pintozone(zone))+' is detecting motion')
                     if(armed[0]):
                         emailzone(pintozone(zone))
                 
             else:
                print('Zone '+str(pintozone(zone))+' is no longer detecting motion')



GPIO.cleanup()
